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
    compileSafety = true
    strictSafety = true       // 기본적으로 자동 감지됨
    skipDefaultValues = true
    unsafeDslChecks = true
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

### compileSafety

- **타입**: Boolean
- **기본값**: `true`
- **설명**: 컴파일 시간 의존성 검증을 활성화합니다. 활성화하면 플러그인이 빌드 시간에 모든 의존성이 해결될 수 있는지 검증하여, 런타임 전에 누락된 정의, 한정자(qualifier) 불일치, 잘못된 호출 지점을 찾아냅니다.
- **사용법**: 기본적으로 활성화되어 있습니다. 마이그레이션 중에 검증을 건너뛰어야 하는 경우 일시적으로 비활성화하세요.

```kotlin
koinCompiler {
    compileSafety = true
}
```

검증되는 내용에 대한 자세한 내용은 [컴파일 시간 안전성(Compile-Time Safety)](/docs/reference/koin-compiler/compile-safety)을 참조하세요.

### strictSafety

- **타입**: Boolean
- **기본값**: 자동 감지(`startKoin`, `koinApplication` 또는 `@KoinApplication`을 포함하는 어그리게이터(aggregator) 모듈에서 활성화됨)
- **설명**: 모든 빌드에서 전체 그래프 안전성 검사(A3)를 강제로 재실행하여, 어그리게이터 모듈에서 Kotlin의 증분 컴파일(incremental compilation) 캐시를 우회합니다. 라이브러리 및 피처 모듈은 완전한 증분 상태를 유지합니다.
- **사용법**: 기본값으로 두세요. 자동 감지가 어그리게이터를 놓치는 경우 명시적으로 `true`로 설정하거나, 옵트아웃하려는 경우(예: 테스트 픽스처가 주석에서만 `startKoin`을 참조하여 감지기를 트리거하는 경우) `false`로 설정하세요.

```kotlin
koinCompiler {
    strictSafety = true   // 강제 활성화
    // 또는
    strictSafety = false  // 자동 감지 옵트아웃
}
```

**존재 이유**: 현재 K2의 증분 컴파일(AGP에서 사용하는 Build Tools API를 통한 방식)은 DI 그래프가 의존하는 두 가지 사항을 추적하지 않습니다. `module { … }` 람다 본문 내부의 DSL 정의(어떤 선언의 ABI에도 포함되지 않음)와 `@ComponentScan` 패키지 범위 검색(스캐너에서 새로 추가된 클래스로의 소스 수준 연결이 없음)입니다. 이로 인해 그래프가 변경되었음에도 어그리게이터의 `compileKotlin` 태스크가 UP-TO-DATE로 표시될 수 있습니다. `strictSafety`는 현재 K2 증분 컴파일이 노출하는 정보 위에서 구현할 수 있는 가장 작고 정확한 해결책(workaround)입니다. 매 빌드마다 어그리게이터만 재실행되므로 비용이 제한적입니다.

`compileSafety = false`인 경우에는 효과가 없습니다. 배경 지식은 [koin-compiler-plugin issue #32](https://github.com/InsertKoinIO/koin-compiler-plugin/issues/32)를 참조하세요.

### skipDefaultValues

- **타입**: Boolean
- **기본값**: `true`
- **설명**: 활성화하면 Kotlin 기본값(default values)이 있는 파라미터는 DI 컨테이너에서 해결되지 않고 기본값을 사용합니다. Nullable 파라미터와 어노테이션이 달린 파라미터(`@Named`, `@InjectedParam` 등)는 여전히 정상적으로 해결됩니다.
- **사용법**: 기본적으로 활성화되어 있습니다. 항상 DI 컨테이너에서 모든 파라미터를 주입하려면 비활성화하세요.

```kotlin
koinCompiler {
    skipDefaultValues = true
}
```

### unsafeDslChecks

- **타입**: Boolean
- **기본값**: `true`
- **설명**: 람다(lambda) 내부의 DSL 함수 호출(예: `create()`)이 유일한 명령인지 검증합니다. 이는 일반적인 실수를 방지하는 데 도움이 됩니다.
- **사용법**: 필요한 경우 클래식 DSL에서 마이그레이션하는 동안 일시적으로 비활성화하세요.

```kotlin
koinCompiler {
    unsafeDslChecks = false  // 마이그레이션 중 비활성화
}
```

## 전체 예시

```kotlin
// build.gradle.kts
plugins {
    alias(libs.plugins.koin.compiler)
}

koinCompiler {
    userLogs = true           // 컴포넌트 감지 로그 기록
    debugLogs = false         // 상세 로그 (기본적으로 꺼짐)
    compileSafety = true      // 컴파일 시간 의존성 검증
    strictSafety = true       // 어그리게이터의 안전성 검사 재실행 강제 (기본적으로 자동 감지됨)
    skipDefaultValues = true  // DI 해결 대신 Kotlin 기본값 사용
    unsafeDslChecks = true    // DSL 사용 검증
}
```

## 권장 사항 (Best Practices)

- 컴파일 시간 의존성 검증을 위해 **`compileSafety`를 활성화된 상태(기본값)로 유지**하세요.
- **`strictSafety`를 자동 감지 상태로 두세요.** 감지기가 어그리게이터를 놓치거나 어그리게이터가 아닌 파일에서 잘못 작동하는 경우에만 재정의하세요.
- Kotlin 기본값을 존중하기 위해 **`skipDefaultValues`를 활성화된 상태(기본값)로 유지**하세요.
- 개발 중에 어떤 컴포넌트가 감지되는지 확인하려면 **`userLogs`를 활성화**하세요.
- 더 안전한 DSL 사용을 위해 **`unsafeDslChecks`를 활성화된 상태(기본값)로 유지**하세요.
- 플러그인 문제를 해결할 때만 **`debugLogs`를 사용**하세요.

## 참고 항목

- **[컴파일 시간 안전성 (Compile-Time Safety)](/docs/reference/koin-compiler/compile-safety)** - 검증되는 내용 및 방법
- **[컴파일러 플러그인 설정 (Compiler Plugin Setup)](/docs/setup/compiler-plugin)** - 전체 설정 가이드
- **[어노테이션 시작하기 (Starting with Annotations)](/docs/reference/koin-annotations/start)** - 시작 가이드