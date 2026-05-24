---
title: 설정 및 버전
---

# Koin 설정하기

이 가이드는 프로젝트에 Koin을 추가하는 데 필요한 모든 내용을 다룹니다.

## 빠른 시작

시작하려면 플랫폼을 선택하세요:

| 플랫폼 | 패키지 | 가이드 |
|----------|---------|-------|
| **Kotlin/JVM** | `koin-core` | [Gradle 설정](/docs/setup/gradle#kotlin) |
| **Android** | `koin-android` | [Gradle 설정](/docs/setup/gradle#android) |
| **Android + Jetpack Compose** | `koin-android` + `koin-compose` | [Gradle 설정](/docs/setup/gradle#compose-android) |
| **Compose Multiplatform** | `koin-compose` | [Gradle 설정](/docs/setup/gradle#compose) |
| **Kotlin Multiplatform** | `koin-core` | [Gradle 설정](/docs/setup/gradle#kotlin-multiplatform) |
| **Ktor** | `koin-ktor` | [Gradle 설정](/docs/setup/gradle#ktor) |

## 권장 설정: BOM + 컴파일러 플러그인 (Compiler Plugin)

최상의 경험을 위해 다음을 권장합니다:

1. **Koin BOM 사용** - 모든 Koin 라이브러리 버전을 관리합니다.
2. **Koin 컴파일러 플러그인(Compiler Plugin) 사용** - 컴파일 타임 안정성을 제공합니다.

자세한 지침은 **[컴파일러 플러그인 설정 가이드](/docs/setup/compiler-plugin)**를 참조하세요.

## 설정 가이드

### [Gradle 설정](/docs/setup/gradle)

모든 플랫폼에 대한 전체 의존성 설정:
- Koin BOM (권장)
- 버전 카탈로그 (Version catalogs)
- 플랫폼별 패키지
- 테스트 의존성

### [컴파일러 플러그인 설정](/docs/setup/compiler-plugin)

Koin 컴파일러 플러그인에 대한 자세한 가이드:
- Gradle 플러그인 설정
- 설정 옵션
- Kotlin 버전 요구 사항
- 트러블슈팅

### [KSP 프로세서(Processor) 설정](/docs/setup/annotations-ksp) (더 이상 사용되지 않음)

Koin 애노테이션(Annotations)을 위한 KSP 기반 프로세서인 `koin-ksp-compiler`에 대한 기존 설정:
- ⚠️ `koin-ksp-compiler`는 더 이상 사용되지 않습니다(Deprecated) — Koin 컴파일러 플러그인으로 마이그레이션하세요.
- Koin 애노테이션(Annotations) 자체는 더 이상 사용되지 않는 것이 아닙니다. `koin-annotations`는 이제 Koin 메인 프로젝트의 일부입니다.
- 마이그레이션 가이드 포함

## 버전 호환성

| Koin 버전 | Kotlin 버전 | Koin 컴파일러 플러그인 |
|--------------|----------------|----------------------|
| 4.2.x | 2.3+ | ✅ 권장됨 |
| 4.1.x | 2.1/2.2+ | ⚠️ KSP 프로세서(Processor) 전용 |
| 4.0.x | 1.9/2.0+ | ⚠️ KSP 프로세서(Processor) 전용 |
| 3.5.x | 1.8+ | ❌ 이용 불가 |

## 현재 버전

- **Koin**: [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-core?label=latest)](https://mvnrepository.com/artifact/io.insert-koin/koin-core)
- **Koin Compiler Plugin**: [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-compiler-plugin?label=latest)](https://mvnrepository.com/artifact/io.insert-koin/koin-compiler-plugin)

모든 Koin 패키지는 [Maven Central](https://central.sonatype.com/search?q=io.insert-koin+koin-core&sort=name)에서 찾을 수 있습니다.

## 다음 단계

설정 후:
- **[핵심 개념 (Core Concepts)](/docs/reference/koin-core/starting-koin)** - Koin 사용법 배우기
- **[튜토리얼](/docs/quickstart/kotlin)** - 첫 번째 앱 만들기
- **[Android 통합](/docs/reference/koin-android/start)** - Android 전용 기능