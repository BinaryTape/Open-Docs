---
title: Koin
---

프로젝트에 Koin을 설정하는 데 필요한 모든 것

## 현재 버전

모든 Koin 패키지는 [Maven Central](https://central.sonatype.com/search?q=io.insert-koin+koin-core&sort=name)에서 찾아볼 수 있습니다.

현재 사용 가능한 Koin 버전은 다음과 같습니다:

- Koin 안정(Stable) 버전 [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-core?label=stable)](https://mvnrepository.com/artifact/io.insert-koin/koin-core)
- Koin 최신(Latest) 버전 [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-core)](https://mvnrepository.com/artifact/io.insert-koin/koin-core)

## Koin BOM (권장)

:::info
**권장 사항(Best Practice)**: 모든 Koin 라이브러리 버전을 일관되게 관리하려면 Koin BOM(Bill of Materials)을 사용하세요. 이는 모든 프로젝트에 권장되는 방식입니다.
:::

Koin BOM(Bill of Materials)을 사용하면 BOM 버전만 지정하여 모든 Koin 라이브러리 버전을 관리할 수 있습니다. BOM 자체는 다양한 Koin 라이브러리의 안정적인 버전들로 연결되어 있어, 서로 잘 작동하도록 구성되어 있습니다. 앱에서 BOM을 사용할 때는 Koin 라이브러리 의존성 자체에 버전을 추가할 필요가 없습니다. BOM 버전을 업데이트하면 사용 중인 모든 라이브러리가 자동으로 새 버전으로 업데이트됩니다.

### 버전 카탈로그(Version Catalogs)와 함께 BOM 사용하기 (권장)

`gradle/libs.versions.toml` 파일에서:

```toml
[versions]
koin-bom = "4.1.1"  # 안정 버전

[libraries]
koin-bom = { module = "io.insert-koin:koin-bom", version.ref = "koin-bom" }
koin-core = { module = "io.insert-koin:koin-core" }
koin-android = { module = "io.insert-koin:koin-android" }
koin-androidx-compose = { module = "io.insert-koin:koin-androidx-compose" }
koin-compose = { module = "io.insert-koin:koin-compose" }
koin-compose-viewmodel = { module = "io.insert-koin:koin-compose-viewmodel" }
koin-ktor = { module = "io.insert-koin:koin-ktor" }
koin-test = { module = "io.insert-koin:koin-test" }
```

`build.gradle.kts` 파일에서:

```kotlin
dependencies {
    implementation(platform(libs.koin.bom))
    implementation(libs.koin.core)
    // 버전 명시 없이 다른 Koin 의존성 추가
}
```

### 버전 카탈로그 없이 BOM 사용하기

```kotlin
dependencies {
    // koin-bom 버전 선언
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))

    // 버전 명시 없이 koin 의존성 선언
    implementation("io.insert-koin:koin-android")
    implementation("io.insert-koin:koin-core-coroutines")
    implementation("io.insert-koin:koin-androidx-workmanager")

    // 특정 의존성에 대해 다른 버전을 지정해야 하는 경우
    implementation("io.insert-koin:koin-androidx-navigation:1.2.3-alpha03")

    // 테스트 라이브러리도 지원합니다!
    testImplementation("io.insert-koin:koin-test-junit4")
    testImplementation("io.insert-koin:koin-android-test")
}
```

## 플랫폼별 설정

### Kotlin

애플리케이션에 Koin BOM과 `koin-core` 의존성을 추가하세요:

```kotlin
dependencies {
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))
    implementation("io.insert-koin:koin-core")
}
```

또는 정확한 의존성 버전을 명시하는 기존 방식을 사용하세요 (권장되지 않음):

```kotlin
dependencies {
    implementation("io.insert-koin:koin-core:$koin_version")
}
```

이제 Koin을 시작할 준비가 되었습니다:

```kotlin
fun main() {
    startKoin {
        modules(...)
    }
}
```

테스트 기능이 필요한 경우:

```kotlin
dependencies {
    // Koin 테스트 기능
    testImplementation("io.insert-koin:koin-test:$koin_version")
    // JUnit 4용 Koin
    testImplementation("io.insert-koin:koin-test-junit4:$koin_version")
    // JUnit 5용 Koin
    testImplementation("io.insert-koin:koin-test-junit5:$koin_version")
}
```

:::info
**다음 단계**: [Kotlin 앱 튜토리얼](/docs/quickstart/kotlin)을 계속 진행하거나 [핵심 기능(Core Features)](/docs/reference/koin-core/dsl)을 살펴보세요.
:::

### Android

Android 애플리케이션에 `koin-android` 의존성을 추가하세요:

```kotlin
dependencies {
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))
    implementation("io.insert-koin:koin-android")
}
```

이제 `Application` 클래스에서 Koin을 시작할 준비가 되었습니다:

```kotlin
class MainApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        startKoin {
            androidLogger()
            androidContext(this@MainApplication)
            modules(appModule)
        }
    }
}
```

추가 기능이 필요한 경우, 아래 패키지들을 추가하세요:

```kotlin
dependencies {
    // Java 호환성
    implementation("io.insert-koin:koin-android-compat")
    // Jetpack WorkManager
    implementation("io.insert-koin:koin-androidx-workmanager")
    // Navigation Graph
    implementation("io.insert-koin:koin-androidx-navigation")
    // App Startup - AndroidX Startup으로 Koin 시작하기
    implementation("io.insert-koin:koin-androidx-startup")
}
```

:::info
**다음 단계**: [Android 앱 튜토리얼](/docs/quickstart/android-viewmodel)을 계속 진행하거나 상세한 통합 방법은 [Android에서 Koin 시작하기](/docs/reference/koin-android/start)를 참조하세요.
:::

### Jetpack Compose 또는 Compose Multiplatform

**Compose Multiplatform**(Android, iOS, Desktop, Web)의 경우, 다음 의존성들을 추가하세요:

```kotlin
dependencies {
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))
    implementation("io.insert-koin:koin-compose")
    implementation("io.insert-koin:koin-compose-viewmodel")
    implementation("io.insert-koin:koin-compose-viewmodel-navigation")
}
```

**순수 Android Jetpack Compose**를 사용하는 경우, 다음을 사용할 수 있습니다:

```kotlin
dependencies {
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))
    implementation("io.insert-koin:koin-androidx-compose")
    implementation("io.insert-koin:koin-androidx-compose-navigation")
}
```

**Navigation 3 통합**(실험적 기능):

```kotlin
dependencies {
    // Navigation 3 지원 (alpha)
    implementation("io.insert-koin:koin-compose-navigation3")
}
```

:::warning
Navigation 3는 알파(alpha) 단계입니다. 자세한 내용은 [Navigation 3 통합](/docs/reference/koin-compose/navigation3)을 참조하세요.
:::

:::info
**다음 단계**: [Compose 튜토리얼](/docs/quickstart/android-compose)을 계속 진행하거나 상세한 통합 방법은 [Koin Compose](/docs/reference/koin-compose/compose)를 참조하세요.
:::

### Kotlin Multiplatform

`shared/build.gradle.kts` 파일의 `commonMain`에 `koin-core` 의존성을 추가하세요:

```kotlin
kotlin {
    sourceSets {
        commonMain.dependencies {
            implementation(platform("io.insert-koin:koin-bom:$koin_version"))
            implementation("io.insert-koin:koin-core")
        }

        commonTest.dependencies {
            implementation("io.insert-koin:koin-test")
        }
    }
}
```

:::info
**다음 단계**: 플랫폼별 설정, expect/actual 패턴 및 아키텍처 가이드는 [Koin을 이용한 Kotlin Multiplatform](/docs/reference/koin-mp/kmp)을 참조하세요.
:::

### Ktor

Ktor 애플리케이션에 `koin-ktor` 의존성을 추가하세요:

```kotlin
dependencies {
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))
    // Ktor용 Koin
    implementation("io.insert-koin:koin-ktor")
    // SLF4J 로거
    implementation("io.insert-koin:koin-logger-slf4j")
}
```

이제 Ktor 애플리케이션에 Koin 기능을 설치할 준비가 되었습니다:

```kotlin
fun Application.main() {
    install(Koin) {
        slf4jLogger()
        modules(appModule)
    }
}
```

:::info
**다음 단계**: [Ktor 앱 튜토리얼](/docs/quickstart/ktor)을 계속 진행하거나 상세한 설정 방법은 [Ktor 통합](/docs/reference/koin-ktor/ktor)을 참조하세요.
:::

## 대안: 직접 버전 명시하기

BOM 사용을 원하지 않는 경우, 각 의존성에 대해 버전을 직접 명시할 수 있습니다:

```kotlin
dependencies {
    implementation("io.insert-koin:koin-core:$koin_version")
    implementation("io.insert-koin:koin-android:$koin_version")
    implementation("io.insert-koin:koin-compose:$koin_version")
}
```

:::note
이 방식은 모든 Koin 의존성을 호환되는 버전으로 직접 동기화해야 합니다. 버전 충돌을 방지하기 위해 **BOM을 사용하는 것을 강력히 권장합니다.**
:::