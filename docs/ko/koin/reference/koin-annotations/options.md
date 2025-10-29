---
title: KSP 컴파일러 옵션
---

Koin Annotations KSP 프로세서는 코드 생성 동작을 사용자 정의하기 위해 컴파일 중에 전달될 수 있는 몇 가지 구성 옵션을 지원합니다.

## 사용 가능한 옵션

### KOIN_CONFIG_CHECK
- **유형**: 불리언
- **기본값**: `false`
- **설명**: Koin 정의에 대한 컴파일 타임 구성 검사를 활성화합니다. 활성화되면 컴파일러는 컴파일 시점에 모든 Koin 구성을 검증하여 안전성을 보장하고 잠재적인 문제를 조기에 발견할 수 있도록 합니다.
- **사용법**: 런타임 이전에 구성 문제를 감지하여 컴파일 타임 안전성에 기여합니다.

### KOIN_LOG_TIMES
- **유형**: 불리언
- **기본값**: `false`
- **설명**: 컴파일 중 모듈 생성에 대한 타이밍 로그를 표시합니다. 이는 코드 생성의 성능을 모니터링하고 잠재적인 병목 현상을 식별하는 데 도움이 됩니다.
- **사용법**: 디버깅 및 빌드 시간 최적화에 유용합니다.

### KOIN_DEFAULT_MODULE
- **유형**: 불리언
- **기본값**: `false`
- **상태**: ⚠️ **1.3.0부터 더 이상 사용되지 않음 (Deprecated)**
- **설명**: 주어진 정의에 대해 명시적인 모듈이 발견되지 않은 경우 기본 모듈을 자동으로 생성합니다. **이 옵션은 Annotations 1.3.0부터 더 이상 사용되지 않으며 권장되지 않습니다.** 대신, `@Configuration` 어노테이션과 `@KoinApplication`을 사용하여 애플리케이션을 자동으로 부트스트랩하세요.
- **사용법**: 이 옵션 사용을 피하세요. 더 나은 코드 명확성과 유지보수성을 위해 `@Configuration` 및 `@KoinApplication`을 사용한 명시적인 모듈 구성을 선호하세요.

### KOIN_GENERATION_PACKAGE
- **유형**: 문자열
- **기본값**: `"org.koin.ksp.generated"`
- **설명**: 생성된 Koin 클래스가 배치될 패키지 이름을 지정합니다. 패키지 이름은 유효한 Kotlin 패키지 식별자여야 합니다. **중요**: 이 옵션을 설정할 경우 모든 모듈에서 동일한 값으로 일관되게 사용해야 합니다.
- **사용법**: 프로젝트가 기본 경로와 다른 경로에 코드를 생성해야 하는 경우에만 이 옵션을 사용하세요(예: 특정 코딩 규칙 또는 프로젝트 구조 요구 사항으로 인해). 모든 모듈이 동일한 패키지 이름을 사용하도록 하세요.

### KOIN_USE_COMPOSE_VIEWMODEL
- **유형**: 불리언
- **기본값**: `true`
- **설명**: Android 전용 ViewModel 대신 `koin-core-viewmodel`의 메인 DSL을 사용하여 ViewModel 정의를 생성합니다. 이는 Kotlin Multiplatform 호환성을 제공하고 통합 ViewModel API를 사용하기 위해 기본적으로 활성화되어 있습니다.
- **사용법**: 모든 프로젝트에서 활성화 상태를 유지하는 것이 좋습니다. 여러 플랫폼에서 ViewModel 지원이 필요한 KMP 프로젝트에 필수적입니다.

### KOIN_EXPORT_DEFINITIONS
- **유형**: 불리언
- **기본값**: `true`
- **설명**: 모듈로 구성된 정의 외에 내보낸 정의도 생성할지 여부를 제어합니다. 비활성화되면 모듈에 구성된 정의만 생성되며, 독립적으로 내보낸 정의는 필터링됩니다.
- **사용법**: 명시적으로 모듈에 구성된 정의만 생성하고 독립적으로 내보낸 정의는 제외하고 싶은 경우 `false`로 설정하세요. 더 엄격한 모듈 구성에 유용합니다.

## 구성 예시

### Gradle Kotlin DSL

```kotlin
ksp {
    arg("KOIN_CONFIG_CHECK", "true")
    arg("KOIN_LOG_TIMES", "true")
    arg("KOIN_DEFAULT_MODULE", "false")
    arg("KOIN_GENERATION_PACKAGE", "com.mycompany.koin.generated")
    arg("KOIN_USE_COMPOSE_VIEWMODEL", "true")
    arg("KOIN_EXPORT_DEFINITIONS", "true")
}
```

### Gradle Groovy DSL

```groovy
ksp {
    arg("KOIN_CONFIG_CHECK", "true")
    arg("KOIN_LOG_TIMES", "true")
    arg("KOIN_DEFAULT_MODULE", "false")
    arg("KOIN_GENERATION_PACKAGE", "com.mycompany.koin.generated")
    arg("KOIN_USE_COMPOSE_VIEWMODEL", "true")
    arg("KOIN_EXPORT_DEFINITIONS", "true")
}
```

## 모범 사례

- 개발 빌드에서 **KOIN_CONFIG_CHECK**를 활성화하여 구성 문제를 조기에 발견하세요.
- 빌드 최적화 중 **KOIN_LOG_TIMES**를 사용하여 성능 병목 현상을 식별하세요.
- 코딩 규칙 준수를 위해 필요한 경우에만 **KOIN_GENERATION_PACKAGE**를 사용하세요. 모든 모듈에서 일관되게 사용해야 합니다.
- 여러 플랫폼에서 통합 ViewModel API를 위해 **KOIN_USE_COMPOSE_VIEWMODEL**을 활성화 상태(기본값)로 유지하세요.
- **KOIN_DEFAULT_MODULE** 사용을 피하고, 적절한 애플리케이션 부트스트랩을 위해 `@Configuration` 및 `@KoinApplication`을 사용하세요.

## 패키지 이름 유효성 검사

`KOIN_GENERATION_PACKAGE`를 사용할 때, 제공되는 패키지 이름은 다음을 준수해야 합니다:
- 비어 있지 않아야 합니다.
- 점으로 구분된 유효한 Kotlin 식별자만 포함해야 합니다.
- Kotlin 키워드 또는 예약어를 사용해서는 안 됩니다.
- 표준 Java/Kotlin 패키지 명명 규칙을 따라야 합니다.

유효하지 않은 패키지 이름은 설명적인 메시지와 함께 컴파일 오류를 발생시킵니다.