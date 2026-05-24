---
title: Koin Annotations란 무엇인가요?
---

# Koin Annotations란 무엇인가요?

### 친숙한 어노테이션 스타일 — 메인 Koin 프로젝트의 일부

**Koin Annotations**는 Koin에서 의존성을 정의하기 위한 어노테이션 기반 방식입니다. Kotlin DSL보다 `@Singleton`, `@Factory`, `@KoinViewModel`과 같은 스타일을 선호하신다면 이 방식이 적합합니다.

이것은 **메인 Koin 프로젝트의 일부**로, 동일한 GitHub 저장소, 동일한 출시 주기, 동일한 Koin 버전 및 동일한 유지관리자가 관리합니다. 사이드 프로젝트나 커뮤니티 포크, 별개의 프레임워크가 아닙니다. DSL과 마찬가지로 컴파일 타임 안전성을 위해 **Koin Compiler Plugin**에 의해 처리됩니다.

## 핵심 요약

```kotlin
@Singleton
class UserRepository(private val api: ApiService)

@KoinViewModel
class UserViewModel(private val repository: UserRepository) : ViewModel()

@Module
@ComponentScan("com.myapp")
class AppModule
```

핵심은 간단합니다. 클래스에 어노테이션을 달고 모듈을 선언하면, 빌드 타임에 Koin Compiler Plugin이 나머지를 연결해 줍니다.

## 메인 Koin 프로젝트의 일부

`koin-annotations` 라이브러리는 **메인 Koin 프로젝트의 일부**입니다. `koin-core`와 동일한 저장소에 있으며, 동일한 출시 주기를 따르는 **동일한 Koin 버전**으로 제공되고 Koin BOM(Bill of Materials)에 포함됩니다.

```kotlin
dependencies {
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))
    implementation("io.insert-koin:koin-core")
    implementation("io.insert-koin:koin-annotations") // 동일한 Koin 버전, 동일한 BOM
}
```

실제로는 다음과 같은 의미를 가집니다:

- **지원 중단되지 않음** — 어노테이션은 일급(first-class) 시민이자 완전히 지원되는 스타일입니다.
- **별도의 제품이 아님** — 개별적으로 추적해야 할 별도의 "Koin Annotations" 프로젝트가 없습니다.
- **버전이 동기화되어 유지됨** — `koin-core`와 `koin-annotations`의 버전은 항상 일치합니다.
- **DSL과 완전한 기능 동일성** — DSL로 할 수 있는 모든 작업은 어노테이션으로도 가능합니다.

## 이제 Koin Compiler Plugin으로 구동됩니다

Koin Annotations는 Kotlin 컴파일러와 직접 통합되는 네이티브 **Kotlin Compiler Plugin (K2)**인 **Koin Compiler Plugin**에 의해 처리됩니다. KSP도 없고, 커밋해야 할 생성된 파일도 없으며, 추가적인 처리 단계도 필요 없습니다.

제공되는 이점:

- **자동 연결(Auto-wiring)** — 생성자 파라미터가 자동으로 감지되고 해결됩니다.
- **컴파일 타임 안전성** — 누락된 의존성, 한정자(qualifier) 불일치, 잘못된 바인딩 등을 빌드 타임에 잡아냅니다.
- **더 단순한 KMP 설정** — 타겟별 KSP 설정이 필요하지 않습니다.
- **동일한 어노테이션** — `@Singleton`, `@Factory`, `@KoinViewModel`, `@Module`, `@ComponentScan`, `@Named`, `@InjectedParam` 등을 그대로 사용합니다.

어떻게 작동하고 무엇을 생성하는지에 대한 자세한 내용은 [Koin Compiler Plugin](/docs/intro/koin-compiler-plugin)을 참조하세요.

## koin-ksp-compiler 지원 중단(Deprecated)

:::warning
기존의 KSP 프로세서인 `koin-ksp-compiler`는 **지원 중단(deprecated)**되었으며, 향후 Koin 버전에서 제거될 예정입니다.
:::

어노테이션 자체는 지원 중단되지 않았으며, 이를 처리하던 KSP 기반 프로세서만 해당됩니다. 마이그레이션 방식은 기계적입니다:

- **동일한 어노테이션** — 사용 중인 `@Singleton`, `@Module`, `@ComponentScan` 코드는 그대로 유지됩니다.
- **KSP 플러그인 제거** — Koin Compiler Plugin으로 교체하세요.
- **생성된 파일 삭제** — Compiler Plugin은 눈에 보이는 생성된 소스 파일을 만들지 않습니다.

단계별 안내는 [KSP에서 Compiler Plugin으로 마이그레이션하기](/docs/migration/from-ksp-to-compiler-plugin)를 참조하세요.

## 어노테이션을 선택해야 하는 경우

어노테이션과 DSL 모두 일급 시민입니다. 다음과 같은 경우 어노테이션을 선택하세요:

- Hilt, Dagger 또는 Spring을 사용해 본 경험이 있어 친숙한 스타일을 원하는 경우
- 클래스 정의와 해당 클래스의 의존성 정의를 같은 위치에 두는 것을 선호하는 경우
- 팀에서 어노테이션 기반 설정을 표준으로 사용하는 경우

Kotlin 네이티브 방식의 코드 전용 스타일을 선호한다면 DSL을 선택하세요. 또한 동일한 프로젝트에서 **두 방식을 혼합**하여 사용할 수도 있습니다. 두 방식 모두 동일한 Compiler Plugin에 의해 처리됩니다.

## 다음 단계

- **[Koin Compiler Plugin](/docs/intro/koin-compiler-plugin)** — 플러그인이 어노테이션을 구동하는 방식
- **[어노테이션 레퍼런스](/docs/reference/koin-annotations/start)** — 전체 어노테이션 카탈로그 및 패턴
- **[KSP에서 Compiler Plugin으로 마이그레이션하기](/docs/migration/from-ksp-to-compiler-plugin)** — `koin-ksp-compiler`에서의 업그레이드 경로
- **[Koin이란 무엇인가요?](/docs/intro/what-is-koin)** — 전체적인 개요