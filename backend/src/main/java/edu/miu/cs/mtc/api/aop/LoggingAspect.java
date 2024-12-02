package edu.miu.cs.mtc.api.aop;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
public class LoggingAspect {

  @Pointcut("execution(* edu.miu.cs.mtc.api.service..*(..))")
  public void serviceMethods() {}

  @Pointcut("execution(* edu.miu.cs.mtc.api.controller..*(..))")
  public void controllerMethods() {}

  @Pointcut("execution(* edu.miu.cs.mtc.api.repository..*(..))")
  public void repositoryMethods() {}

  @Pointcut("serviceMethods() || controllerMethods() || repositoryMethods()")
  public void applicationFlow() {}

  // Around advice for logging execution details
  @Around("applicationFlow()")
  public Object logExecutionDetails(ProceedingJoinPoint joinPoint) throws Throwable {
    String methodName = joinPoint.getSignature().toShortString();
    Object[] args = joinPoint.getArgs();

    log.info("Method [{}] called with arguments: {}", methodName, args);

    long startTime = System.currentTimeMillis();

    Object result;
    try {
      result = joinPoint.proceed(); // Execute the target method
    } catch (Throwable throwable) {
      log.error(
          "Method [{}] threw an exception: {}", methodName, throwable.getMessage(), throwable);
      throw throwable;
    }

    long endTime = System.currentTimeMillis();
    log.info(
        "Method [{}] executed in {} ms with return value: {}",
        methodName,
        (endTime - startTime),
        result);

    return result;
  }
}
