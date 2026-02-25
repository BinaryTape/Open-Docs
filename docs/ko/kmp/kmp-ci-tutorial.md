[//]: # (title: Kotlin Multiplatform 애플리케이션의 지속적 통합을 위한 GitHub Actions 설정하기)

<web-summary>GitHub Actions를 사용하여 Kotlin Multiplatform (KMP) 앱의 지속적 통합(CI/CD)을 설정하는 방법을 배워보세요.
CI를 사용하여 공통 테스트를 실행하고 iOS, Android 및 데스크톱용 아티팩트를 빌드할 수 있습니다.</web-summary>

이 가이드는 GitHub Actions로 설정된 Kotlin Multiplatform 애플리케이션의 지속적 통합(CI) 예시를 보여줍니다.
`main` 브랜치에 대한 모든 푸시(push) 또는 풀 리퀘스트(pull request) 발생 시 공통 테스트를 실행하고 Android, iOS 및 데스크톱용 아티팩트(artifact)를 빌드하는 워크플로(workflow)를 설정하게 됩니다.

이 가이드는 [Jetcaster KMP 샘플](https://github.com/kotlin-hands-on/jetcaster-kmp-migration/)을 기반으로 합니다.
[저장소에서 액션 및 워크플로 설정](https://github.com/kotlin-hands-on/jetcaster-kmp-migration/tree/main/.github)을 확인하거나, 아래의 단계를 따라 단계별 설명을 확인할 수 있습니다.

이 가이드에서는 CI 설정을 두 부분으로 나누어 제안합니다:

* [Java 및 Gradle을 설정하는 재사용 가능한 복합 GitHub 액션(composite GitHub Action)](#gradle-설정을-위한-복합-액션-생성하기)
* `main` 브랜치에 대한 모든 푸시 또는 풀 리퀘스트 시 테스트를 실행하고 플랫폼별 빌드를 트리거하는 [메인 GitHub Actions 워크플로](#빌드-워크플로-정의하기)

## Gradle 설정을 위한 복합 액션 생성하기

여러 잡(job) 간에 Java 및 Gradle 구성을 동기화하기 위해 [복합 액션(composite action)](https://docs.github.com/en/actions/tutorials/create-actions/create-a-composite-action)을 생성합니다.
모든 빌드에 동일한 구성이 사용되도록 워크플로 잡에서 이 액션을 재사용할 것입니다.

이 예시에서 액션은 Java 17을 설치하고 기본 Gradle 버전을 구성합니다.
액션을 설정하려면 `.github/actions/gradle-setup/action.yml` 파일을 생성하세요:

```yaml
name: gradle-setup
description: Setup Java and Gradle
runs:
  using: "composite"
  steps:
    - name: Setup Java
      uses: actions/setup-java@v4.0.0
      with:
        java-version: "17"
        distribution: "temurin"
    - name: Setup Gradle
      uses: gradle/actions/setup-gradle@v5.0.0
```

## 빌드 워크플로 정의하기

워크플로가 실행되는 시점을 정의하고 Gradle 옵션을 구성합니다:

* 워크플로는 `main` 브랜치에 대한 모든 푸시 또는 풀 리퀘스트 시 실행되어야 합니다.
* Gradle 옵션은 Gradle 데몬을 비활성화하고 캐싱을 통한 병렬 실행을 활성화해야 합니다.

기본 구성을 포함하여 `.github/workflows/build.yml` 파일을 생성하세요:

```yaml
name: Build

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:

env:
  GRADLE_OPTS: "-Dorg.gradle.jvmargs=-Xmx4096M -Dorg.gradle.daemon=false -Dorg.gradle.parallel=true -Dorg.gradle.caching=true"
```

이 구성을 사용하면 [workflow_dispatch](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow)를 사용하여 워크플로를 수동으로 트리거할 수도 있습니다.

이제 테스트를 실행하고 애플리케이션 아티팩트를 빌드하는 잡을 추가할 수 있습니다.

### 공통 테스트 실행하기

이 잡은 모든 플랫폼용 앱을 빌드하기 전에 변경 사항을 검증하기 위해 `jvmTest` Gradle 태스크를 사용하여 테스트를 실행합니다:

1. 테스트를 실행할 저장소를 체크아웃합니다.
2. 앞서 준비한 복합 `gradle-setup` 액션을 사용하여 Java 및 Gradle을 설정합니다.
3. `./gradlew` 명령으로 테스트를 실행합니다.
4. 테스트 보고서를 `**/build/reports/tests/` 디렉토리의 아티팩트로 업로드합니다.

이 잡을 설정하려면 `.github/workflows/build.yml` 파일에 다음 내용을 추가하세요:

```yaml
jobs:
  test:
    name: Run tests
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Gradle setup
        uses: ./.github/actions/gradle-setup

      - name: Run unit tests
        run: ./gradlew jvmTest

      - name: Upload test reports
        uses: actions/upload-artifact@v4
        with:
          name: test-reports
          path: "**/build/reports/tests/"
```

테스트가 완료되면 워크플로는 애플리케이션 아티팩트를 빌드해야 합니다.

### Android 디버그 패키지 빌드하기

이 잡은 `:mobile:assembleDebug` Gradle 태스크를 사용하여 Android 디버그 APK를 빌드합니다:

1. 패키지를 빌드할 저장소를 체크아웃합니다.
2. 앞서 준비한 복합 `gradle-setup` 액션을 사용하여 Java 및 Gradle을 설정합니다.
3. `./gradlew` 명령으로 APK를 빌드합니다.
4. `mobile/build/outputs/apk/debug/` 디렉토리에서 빌드된 패키지를 업로드합니다.

`.github/workflows/build.yml` 파일의 `jobs` 섹션에 다음 내용을 이어서 추가하세요:

```yaml
jobs:
  # ...
  build-android:
    name: Build Android
    runs-on: ubuntu-latest
    needs: test
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Gradle setup
        uses: ./.github/actions/gradle-setup

      - name: Build Android debug APK
        run: ./gradlew :mobile:assembleDebug

      - name: Upload Android debug APK
        uses: actions/upload-artifact@v4
        with:
          name: android-apk
          path: mobile/build/outputs/apk/debug/*.apk
```

### iOS 시뮬레이터 애플리케이션 빌드하기

이 잡은 앱에 정식으로 서명할 필요가 없도록 iOS 시뮬레이터(Simulator)를 대상으로 합니다.
애플리케이션은 `xcodebuild`를 사용하여 빌드됩니다:

1. 애플리케이션을 빌드할 저장소를 체크아웃합니다.
2. 앞서 준비한 복합 `gradle-setup` 액션을 사용하여 Java 및 Gradle을 설정합니다.
3. `xcodebuild`를 사용하여 iOS 애플리케이션을 빌드합니다. 예시에서는 Jetcaster KMP 샘플에 사용된 옵션을 보여줍니다.
4. 빌드된 애플리케이션이 포함된 폴더(`build/Build/Products/Debug-iphonesimulator/*` 내부의 모든 것)를 아티팩트로 업로드합니다.

iOS 애플리케이션은 `xcodebuild`가 포함된 macOS 러너(`macos-latest`)에서 빌드됩니다. 

`.github/workflows/build.yml` 파일을 계속 수정합니다:

```yaml
jobs:
  #...
  build-ios:
    name: Build iOS simulator app
    runs-on: macos-latest
    needs: test
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Gradle setup
        uses: ./.github/actions/gradle-setup

      - name: Build iOS simulator app
        run: |
          xcodebuild build \
          -project JetcasterMigration/JetcasterMigration.xcodeproj \
          -configuration Debug \
          -scheme JetcasterMigration \
          -sdk iphonesimulator \
          -derivedDataPath ./build \
          -verbose

      - name: Upload app folder
        uses: actions/upload-artifact@v4
        with:
          name: iphonesimulator-app
          path: build/Build/Products/Debug-iphonesimulator/*
```

## CI 푸시 및 테스트

워크플로 구성을 `main` 브랜치에 푸시하거나 이러한 구성 파일이 포함된 풀 리퀘스트를 생성하면 CI 워크플로가 처음으로 트리거됩니다.

저장소의 **Actions** 탭에서 워크플로 결과를 확인하여 모든 것이 올바르게 작동하는지 검증할 수 있습니다.

워크플로를 수동으로 트리거할 수도 있다는 점을 기억하세요. 왼쪽의 액션 목록에서 워크플로를 선택하고 **Run workflow**를 클릭하면 됩니다.

## 다음 단계

전체 CI 구성 예시는 [Jetcaster 샘플](https://github.com/kotlin-hands-on/jetcaster-kmp-migration/tree/main/.github)을 참조하세요. 여기에는 macOS, Windows 및 Linux용 데스크톱 JVM 애플리케이션을 빌드하는 잡도 포함되어 있습니다.

GitHub Actions를 사용하여 앱 스토어에 애플리케이션을 게시하는 방법에 대한 안내는 [이 주제에 대한 Marco Gomiero의 게시물 시리즈](https://www.marcogomiero.com/posts/2024/kmp-ci-ios/)를 참조하세요.