---
title: 컴파일러 플러그인 옵션
---

Koin 컴파일러 플러그인은 동작을 커스터마이징하기 위한 구성 옵션을 지원합니다.

## 구성

`build.gradle.kts`에서 컴파일러 플러그인을 구성합니다:

```kotlin
koinCompiler {
    userLogs = true
    debugLogs = false
    dslSafetyChecks = true
}
```

## 사용 가능한 옵션

### userLogs

- **타입**: Boolean
- **기본값**: `false`
- **설명**: 컴포넌트 감지 및 DSL/어노테이션(annotation) 처리에 대한 로그를 활성화합니다. 플러그인에 의해 어떤 컴포넌트가 검색되고 처리되는지 보여줍니다.
- **사용법**: 컴포넌트 검색 문제를 디버깅하기 위해 개발 중에 활성화하세요.

```kotlin
koinCompiler {
    userLogs = true
}
```

### debugLogs

- **타입**: Boolean
- **기본값**: `false`
- **설명**: 내부 플러그인 처리(FIR/IR 단계, 모듈 검색)에 대한 상세 디버그 로그를 활성화합니다.
- **사용법**: 플러그인 문제를 해결하거나 버그를 보고할 때 활성화하세요.

```kotlin
koinCompiler {
    debugLogs = true
}
```

### dslSafetyChecks

- **타입**: Boolean
- **기본값**: `true`
- **설명**: 람다(lambda) 내부의 DSL 함수 호출(예: `create()`)이 유일한 명령인지 검증합니다. 이는 일반적인 실수를 방지하는 데 도움이 됩니다.
- **사용법**: 필요한 경우 클래식 DSL에서 마이그레이션하는 동안 일시적으로 비활성화하세요.

```kotlin
koinCompiler {
    dslSafetyChecks = false  // 마이그레이션 중 비활성화
}
```

## 전체 예시

```kotlin
// build.gradle.kts
plugins {
    alias(libs.plugins.koin.compiler)
}

koinCompiler {
    userLogs = true        // 컴포넌트 감지 로그 기록
    debugLogs = false      // 상세 로그 (기본적으로 꺼짐)
    dslSafetyChecks = true // DSL 사용 검증
}
```

## 권장 사항 (Best Practices)

- 개발 중에 **`userLogs`를 활성화**하여 어떤 컴포넌트가 감지되는지 확인하세요.
- 더 안전한 DSL 사용을 위해 **`dslSafetyChecks`를 활성화된 상태(기본값)로 유지**하세요.
- 플러그인 문제를 해결할 때만 **`debugLogs`를 사용**하세요.

## 참고 항목

- **[컴파일러 플러그인 설정 (Compiler Plugin Setup)](/docs/setup/compiler-plugin)** - 전체 설정 가이드
- **[어노테이션 시작하기 (Starting with Annotations)](/docs/reference/koin-annotations/start)** - 시작 가이드