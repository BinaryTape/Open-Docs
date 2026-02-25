---
title: KSP 컴파일러 옵션
---

Koin Annotations KSP 프로세서는 코드 생성 동작을 커스터마이징하기 위해 컴파일 중에 전달할 수 있는 여러 구성 옵션을 지원합니다.

## 사용 가능한 옵션

### KOIN_CONFIG_CHECK
- **타입**: Boolean
- **기본값**: `false`
- **설명**: Koin 정의에 대한 컴파일 타임 구성 체크를 활성화합니다. 활성화하면 컴파일러가 컴파일 타임에 모든 Koin 구성을 검증하여 안전성을 보장하고 잠재적인 문제를 조기에 발견합니다.
- **사용법**: 런타임 전에 구성 문제를 감지하여 컴파일 타임 안전성을 확보하는 데 도움이 됩니다.

### KOIN_LOG_TIMES
- **타입**: Boolean
- **기본값**: `false`
- **설명**: 컴파일 중 모듈 생성에 소요되는 시간 로그를 표시합니다. 이는 코드 생성 성능을 모니터링하고 잠재적인 병목 현상을 식별하는 데 도움이 됩니다.
- **사용법**: 빌드 시간 디버깅 및 최적화에 유용합니다.

### KOIN_DEFAULT_MODULE
- **타입**: Boolean
- **기본값**: `false`
- **상태**: ⚠️ **1.3.0부터 지원 중단(Deprecated)**
- **설명**: 특정 정의에 대해 명시적인 모듈이 발견되지 않으면 자동으로 기본 모듈을 생성합니다. **이 옵션은 Annotations 1.3.0부터 지원이 중단되었으며 권장되지 않습니다.** 대신 `@Configuration` 어노테이션과 `@KoinApplication`을 사용하여 애플리케이션을 자동으로 부트스트랩(bootstrap)하세요.
- **사용법**: 이 옵션의 사용을 피하십시오. 코드 명확성과 유지보수성을 위해 `@Configuration` 및 `@KoinApplication`을 통한 명시적인 모듈 구성을 권장합니다.

### KOIN_GENERATION_PACKAGE
- **타입**: String
- **기본값**: `"org.koin.ksp.generated"`
- **설명**: 생성된 Koin 클래스가 배치될 패키지 이름을 지정합니다. 패키지 이름은 유효한 Kotlin 패키지 식별자여야 합니다. **중요**: 이 옵션을 설정할 경우 모든 모듈에서 동일한 값을 일관되게 사용해야 합니다.
- **사용법**: 특정 코딩 규칙이나 프로젝트 구조 요구 사항으로 인해 프로젝트에서 기본 경로가 아닌 다른 경로에 코드를 생성해야 하는 경우에만 이 옵션을 사용하십시오. 모든 모듈이 동일한 패키지 이름을 사용하는지 확인하십시오.

### KOIN_USE_COMPOSE_VIEWMODEL
- **타입**: Boolean
- **기본값**: `true`
- **설명**: Android 전용 ViewModel 대신 `koin-core-viewmodel` 메인 DSL을 사용하여 ViewModel 정의를 생성합니다. 이는 Kotlin Multiplatform(KMP) 호환성을 제공하고 통합된 ViewModel API를 사용하기 위해 기본적으로 활성화되어 있습니다.
- **사용법**: 모든 프로젝트에서 활성 상태를 유지하는 것을 권장합니다. 플랫폼 전반에 걸쳐 ViewModel 지원이 필요한 KMP 프로젝트에는 필수적입니다.

### KOIN_EXPORT_DEFINITIONS
- **타입**: Boolean
- **기본값**: `true`
- **설명**: 모듈에 조합된(assembled) 정의 외에 내보낸(exported) 정의도 생성할지 여부를 제어합니다. 비활성화하면 모듈에 조합된 정의만 생성되고, 독립형(standalone) 내보낸 정의는 필터링되어 제외됩니다.
- **사용법**: 모듈에 명시적으로 조합된 정의만 생성하고 독립형 내보낸 정의를 제외하려는 경우 `false`로 설정하십시오. 더 엄격한 모듈 구성에 유용합니다.

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

## 권장 사항 (Best Practices)

- 개발 빌드에서 **KOIN_CONFIG_CHECK를 활성화**하여 구성 문제를 조기에 발견하세요.
- 빌드 최적화 중에 **KOIN_LOG_TIMES를 사용**하여 성능 병목 현상을 식별하세요.
- 코딩 규칙 준수를 위해 필요한 경우에만 **KOIN_GENERATION_PACKAGE를 사용**하고, 모든 모듈에서 일관되게 사용되도록 하세요.
- 플랫폼 간 통합된 ViewModel API를 위해 **KOIN_USE_COMPOSE_VIEWMODEL을 활성화된 상태(기본값)로 유지**하세요.
- **KOIN_DEFAULT_MODULE은 피하고**, 적절한 애플리케이션 부트스트랩을 위해 `@Configuration` 및 `@KoinApplication`을 사용하세요.

## 패키지 이름 검증

`KOIN_GENERATION_PACKAGE`를 사용할 때, 제공된 패키지 이름은 다음 사항을 준수해야 합니다:
- 비어 있지 않아야 함
- 점(.)으로 구분된 유효한 Kotlin 식별자만 포함해야 함
- Kotlin 키워드나 예약어를 사용하지 않아야 함
- 표준 Java/Kotlin 패키지 명명 규칙을 따라야 함

유효하지 않은 패키지 이름은 설명 메시지와 함께 컴파일 오류를 발생시킵니다.