---
title: Gradle 설정
---

# Gradle 설정

이 가이드는 Gradle 프로젝트에 Koin 의존성을 추가하는 방법을 다룹니다.

## Koin BOM (권장)

**Bill of Materials (BOM)**는 Koin 의존성을 관리하는 데 권장되는 방식입니다. 이는 모든 Koin 라이브러리가 호환되는 버전을 사용하도록 보장합니다.

:::info
**권장 사항(Best Practice)**: Koin 라이브러리 간의 버전 충돌을 피하기 위해 항상 Koin BOM을 사용하세요.
:::

### 버전 카탈로그 사용 (권장)

`gradle/libs.versions.toml` 파일에서:

```toml
[versions]
koin-bom = "4.2.0"

[libraries]
koin-bom = { module = "io.insert-koin:koin-bom", version.ref = "koin-bom" }
koin-core = { module = "io.insert-koin:koin-core" }
koin-android = { module = "io.insert-koin:koin-android" }
koin-compose = { module = "io.insert-koin:koin-compose" }
koin-compose-viewmodel = { module = "io.insert-koin:koin-compose-viewmodel" }
koin-ktor = { module = "io.insert-koin:koin-ktor" }
koin-test = { module = "io.insert-koin:koin-test" }
```

`build.gradle.kts` 파일에서:

```kotlin
dependencies {
    implementation(platform(libs.koin.bom))
    implementation(libs.koin.android)  // 버전 지정 불필요
}
```

### BOM 직접 사용

```kotlin
dependencies {
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))

    // 버전 없이 의존성 추가
    implementation("io.insert-koin:koin-android")
    implementation("io.insert-koin:koin-compose")  // Android 및 멀티플랫폼에서 작동
}
```

## 플랫폼별 설정

### Kotlin/JVM {#kotlin}

순수 Kotlin 애플리케이션의 경우:

```kotlin
dependencies {
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))
    implementation("io.insert-koin:koin-core")
}
```

애플리케이션에서 Koin 시작:

```kotlin
fun main() {
    startKoin {
        modules(appModule)
    }
}
```

**테스트 의존성:**

```kotlin
dependencies {
    testImplementation("io.insert-koin:koin-test")
    testImplementation("io.insert-koin:koin-test-junit5")  // 또는 junit4
}
```

### Android {#android}

Android 애플리케이션의 경우:

```kotlin
dependencies {
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))
    implementation("io.insert-koin:koin-android")
}
```

Application 클래스에서 Koin 시작:

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

**선택 사항 Android 패키지:**

```kotlin
dependencies {
    // Jetpack WorkManager
    implementation("io.insert-koin:koin-androidx-workmanager")

    // Navigation Graph
    implementation("io.insert-koin:koin-androidx-navigation")

    // AndroidX Startup
    implementation("io.insert-koin:koin-androidx-startup")

    // Java Compatibility
    implementation("io.insert-koin:koin-android-compat")
}
```

### Jetpack Compose를 사용한 Android {#compose-android}

Jetpack Compose를 사용하는 Android 앱의 경우:

```kotlin
dependencies {
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))
    implementation("io.insert-koin:koin-android")
    implementation("io.insert-koin:koin-compose")
    implementation("io.insert-koin:koin-compose-viewmodel")
}
```

**Navigation 사용 시:**

```kotlin
dependencies {
    // Navigation 2 (Android 전용)
    implementation("io.insert-koin:koin-androidx-compose-navigation")

    // 또는 Navigation 3
    implementation("io.insert-koin:koin-compose-navigation3")
}
```

:::info
`koin-androidx-compose`는 이제 `koin-compose`에 포함됩니다.
:::

### Compose 멀티플랫폼(Multiplatform) {#compose}

Compose 멀티플랫폼 프로젝트(Android, iOS, Desktop, Web)의 경우:

```kotlin
dependencies {
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))
    implementation("io.insert-koin:koin-compose")
    implementation("io.insert-koin:koin-compose-viewmodel")
    implementation("io.insert-koin:koin-compose-viewmodel-navigation")
}
```

:::info
`koin-compose`는 Android 지원을 자동으로 포함합니다. Compose 멀티플랫폼 프로젝트에서는 별도의 `koin-android`가 필요하지 않습니다.
:::

### Kotlin 멀티플랫폼(Multiplatform) {#kotlin-multiplatform}

공유 모듈의 `build.gradle.kts`에서:

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

        androidMain.dependencies {
            implementation("io.insert-koin:koin-android")
        }
    }
}
```

### Ktor {#ktor}

Ktor 서버 애플리케이션의 경우:

```kotlin
dependencies {
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))
    implementation("io.insert-koin:koin-ktor")
    implementation("io.insert-koin:koin-logger-slf4j")
}
```

Ktor 애플리케이션에 Koin 설치:

```kotlin
fun Application.module() {
    install(Koin) {
        slf4jLogger()
        modules(appModule)
    }
}
```

## 사용 가능한 모든 패키지

현재 최신 버전: [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-core?label=latest)](https://mvnrepository.com/artifact/io.insert-koin/koin-core)

| 패키지 | 설명 |
|---------|-------------|
| `koin-core` | Koin 코어 라이브러리 |
| `koin-core-coroutines` | 코루틴 지원 |
| `koin-android` | Android 지원 |
| `koin-android-compat` | Android용 Java 호환성 |
| `koin-androidx-navigation` | Navigation 컴포넌트 지원 |
| `koin-androidx-workmanager` | WorkManager 지원 |
| `koin-androidx-startup` | AndroidX Startup 지원 |
| `koin-compose` | Compose (Android 및 멀티플랫폼) |
| `koin-compose-viewmodel` | Compose용 ViewModel |
| `koin-compose-viewmodel-navigation` | Compose 멀티플랫폼용 Navigation + ViewModel |
| `koin-androidx-compose` | ⚠️ 대체됨 - 대신 `koin-compose`를 사용하세요 |
| `koin-androidx-compose-navigation` | Android용 Navigation 2 (KMP 호환되지 않음) |
| `koin-compose-navigation3` | Navigation 3 |
| `koin-ktor` | Ktor 서버 지원 |
| `koin-logger-slf4j` | SLF4J 로깅 |
| `koin-test` | 테스트 유틸리티 |
| `koin-test-junit4` | JUnit 4 지원 |
| `koin-test-junit5` | JUnit 5 지원 |
| `koin-android-test` | Android 계측 테스트(Instrumented testing) |

## 직접 버전 지정

BOM을 사용하지 않으려는 경우:

```kotlin
dependencies {
    implementation("io.insert-koin:koin-core:$koin_version")
    implementation("io.insert-koin:koin-android:$koin_version")
}
```

:::note
이 방식은 모든 의존성을 수동으로 동기화해야 합니다. **BOM 사용을 강력히 권장합니다.**
:::

## 다음 단계

- **[컴파일러 플러그인 설정](/docs/setup/compiler-plugin)** - 컴파일 타임 안정성 추가
- **[Koin 시작하기](/docs/reference/koin-core/starting-koin)** - 애플리케이션 설정
- **[튜토리얼](/docs/quickstart/kotlin)** - 첫 번째 앱 만들기