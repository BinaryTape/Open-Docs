---
title: Koin 어노테이션
---

프로젝트를 위한 Koin 어노테이션 설정하기

## 현재 버전

모든 Koin 패키지는 [maven central](https://search.maven.org/search?q=io.insert-koin)에서 찾을 수 있습니다.

현재 사용 가능한 Koin 어노테이션 버전은 다음과 같습니다.

- **안정 버전(Stable)**: [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-annotations?label=stable)](https://mvnrepository.com/artifact/io.insert-koin/koin-annotations) - 프로덕션 애플리케이션용
- **최신 버전(Latest)**: [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-annotations)](https://mvnrepository.com/artifact/io.insert-koin/koin-annotations) - 향후 제공될 기능 미리보기

## KSP 플러그인

동작을 위해 [Google KSP](https://github.com/google/ksp)가 필요합니다. 공식 [KSP 설정 문서](https://kotlinlang.org/docs/ksp-quickstart.html)를 따르세요.

다음과 같이 Gradle 플러그인을 추가하기만 하면 됩니다.
```kotlin
plugins {
    id("com.google.devtools.ksp") version "$ksp_version"
}
```

**KSP 호환성**: Koin 어노테이션 2.3.1 버전은 KSP `2.3.2` 버전이 필요합니다.

:::info
**KSP 버전 관리 변경**: KSP 2.x부터 버전 번호는 이제 Kotlin 버전과 독립적으로 관리됩니다. Koin 어노테이션 2.3.1에는 KSP 2.3.2를 사용하세요.
:::

## 버전 카탈로그 사용 (권장)

`gradle/libs.versions.toml` 파일에 다음과 같이 작성합니다.

```toml
[versions]
koin-annotations = "2.3.1"  # 안정 버전
ksp = "2.3.2"  # Koin 어노테이션 2.3.1에 필요한 버전

[libraries]
koin-annotations = { module = "io.insert-koin:koin-annotations", version.ref = "koin-annotations" }
koin-ksp-compiler = { module = "io.insert-koin:koin-ksp-compiler", version.ref = "koin-annotations" }

[plugins]
ksp = { id = "com.google.devtools.ksp", version.ref = "ksp" }
```

## Android 및 Ktor 앱 KSP 설정

- KSP Gradle 플러그인 사용
- Koin 어노테이션 및 Koin KSP 컴파일러 의존성 추가
- sourceSet 설정

```kotlin
plugins {
    alias(libs.plugins.ksp)
}

dependencies {
    // Koin
    implementation("io.insert-koin:koin-android:$koin_version")
    // Koin 어노테이션
    implementation("io.insert-koin:koin-annotations:$koin_annotations_version")
    // Koin 어노테이션 KSP 컴파일러
    ksp("io.insert-koin:koin-ksp-compiler:$koin_annotations_version")
}
```

또는 버전 카탈로그를 사용하는 경우:

```kotlin
plugins {
    alias(libs.plugins.ksp)
}

dependencies {
    // Koin
    implementation(libs.koin.android)
    // Koin 어노테이션
    implementation(libs.koin.annotations)
    // Koin 어노테이션 KSP 컴파일러
    ksp(libs.koin.ksp.compiler)
}
```

## Kotlin 멀티플랫폼 설정

표준 Kotlin/Kotlin 멀티플랫폼 프로젝트에서는 다음과 같이 KSP를 설정해야 합니다.

- KSP Gradle 플러그인 사용
- commonMain에 Koin 어노테이션 의존성 추가
- commonMain을 위한 sourceSet 설정
- Koin 컴파일러와 함께 KSP 의존성 작업 추가
- `kspCommonMainKotlinMetadata`에 대한 컴파일 작업 의존성 설정

```kotlin
plugins {
    alias(libs.plugins.ksp)
}

kotlin {

    sourceSets {

        // Koin 어노테이션 추가
        commonMain.dependencies {
            // Koin
            implementation("io.insert-koin:koin-core:$koin_version")
            // Koin 어노테이션
            api("io.insert-koin:koin-annotations:$koin_annotations_version")
        }
    }

    // KSP Common sourceSet
    sourceSets.named("commonMain").configure {
        kotlin.srcDir("build/generated/ksp/metadata/commonMain/kotlin")
    }
}

// KSP 작업
dependencies {
    add("kspCommonMainMetadata", "io.insert-koin:koin-ksp-compiler:$koin_annotations_version")
    add("kspAndroid", "io.insert-koin:koin-ksp-compiler:$koin_annotations_version")
    add("kspIosX64", "io.insert-koin:koin-ksp-compiler:$koin_annotations_version")
    add("kspIosArm64", "io.insert-koin:koin-ksp-compiler:$koin_annotations_version")
    add("kspIosSimulatorArm64", "io.insert-koin:koin-ksp-compiler:$koin_annotations_version")
}

// Native 작업에서 공통 메타데이터 생성 트리거
tasks.matching { it.name.startsWith("ksp") && it.name != "kspCommonMainKotlinMetadata" }.configureEach {
    dependsOn("kspCommonMainKotlinMetadata")
}
```

:::info
전체 KMP 설정 및 아키텍처 패턴은 [Koin 어노테이션 KMP](/docs/reference/koin-annotations/kmp)를 참조하세요.
:::

## 다음 단계

설정이 완료되었습니다! 다음 내용을 확인해 보세요:

- [Koin 어노테이션 시작하기](/docs/reference/koin-annotations/start) - 코드에서 어노테이션을 사용하는 방법 알아보기
- [어노테이션 정의](/docs/reference/koin-annotations/definitions) - 상세 어노테이션 레퍼런스
- [어노테이션 목록](/docs/reference/koin-annotations/annotations-inventory) - 사용 가능한 전체 어노테이션 목록