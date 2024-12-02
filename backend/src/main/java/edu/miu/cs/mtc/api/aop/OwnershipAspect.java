package edu.miu.cs.mtc.api.aop;

import edu.miu.cs.mtc.api.util.AuthUtils;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.data.annotation.Id;
import org.springframework.stereotype.Component;

@Slf4j
@Aspect
@Component
public class OwnershipAspect {

  @Before("execution(* edu.miu.cs.mtc.api.repository..*(..))")
  public void validateOwnership(JoinPoint joinPoint) throws IllegalAccessException {
    if (AuthUtils.isAdminUser()) return;
    Method method = ((MethodSignature) joinPoint.getSignature()).getMethod();
    OwnershipCheck annotation = findOwnershipCheck(joinPoint.getTarget().getClass(), method);
    if (annotation != null) {
      validateOwnership(joinPoint.getArgs(), annotation.ownerField());
    }
  }

  private OwnershipCheck findOwnershipCheck(Class<?> targetClass, Method method) {
    if (targetClass.isAnnotationPresent(OwnershipCheck.class))
      return targetClass.getAnnotation(OwnershipCheck.class);
    if (method.isAnnotationPresent(OwnershipCheck.class))
      return method.getAnnotation(OwnershipCheck.class);
    for (Class<?> iface : targetClass.getInterfaces()) {
      try {
        Method ifaceMethod = iface.getMethod(method.getName(), method.getParameterTypes());
        if (iface.isAnnotationPresent(OwnershipCheck.class))
          return iface.getAnnotation(OwnershipCheck.class);
        if (ifaceMethod.isAnnotationPresent(OwnershipCheck.class))
          return ifaceMethod.getAnnotation(OwnershipCheck.class);
      } catch (NoSuchMethodException ignored) {
      }
    }
    return targetClass.getSuperclass() == null
        ? null
        : findOwnershipCheck(targetClass.getSuperclass(), method);
  }

  private void validateOwnership(Object[] args, String ownerField) throws IllegalAccessException {
    for (Object arg : args) {
      if (arg == null) continue;
      Field field = findField(arg.getClass(), ownerField);
      if (field == null) continue;
      field.setAccessible(true);
      Object id = getIdFieldValue(arg, Id.class);
      if (id == null) {
        return;
      }
      String currentUser =
          AuthUtils.getCurrentUsername()
              .orElseThrow(() -> new SecurityException("You do not own this resource."));
      if (!currentUser.equals(field.get(arg)))
        throw new SecurityException("You do not own this resource.");
    }
  }

  private Field findField(Class<?> clazz, String fieldName) {
    if (clazz == null) return null;
    try {
      return clazz.getDeclaredField(fieldName);
    } catch (NoSuchFieldException ignored) {
      return findField(clazz.getSuperclass(), fieldName);
    }
  }

  public static Object getIdFieldValue(
      Object obj, Class<? extends java.lang.annotation.Annotation> annotationClass) {
    if (obj == null) {
      throw new IllegalArgumentException("Object cannot be null");
    }

    Class<?> clazz = obj.getClass();
    for (Field field : clazz.getDeclaredFields()) {
      if (field.isAnnotationPresent(annotationClass)) {
        try {
          field.setAccessible(true);
          return field.get(obj);
        } catch (IllegalAccessException e) {
          throw new RuntimeException(
              "Failed to access @" + annotationClass.getName() + " field", e);
        }
      }
    }

    throw new IllegalStateException(
        "No @" + annotationClass.getName() + " field found in class " + clazz.getName());
  }
}
