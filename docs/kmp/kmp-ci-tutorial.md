[//]: # (title: 为 Kotlin Multiplatform 应用程序的持续集成配置 GitHub Actions)

<web-summary>了解如何使用 GitHub Actions 为 Kotlin Multiplatform (KMP) 应用设置持续集成 (CI/CD)。使用 CI 来运行共享测试并为 iOS、Android 和桌面端构建构件。</web-summary>

本指南展示了为使用 GitHub Actions 设置的 Kotlin Multiplatform 应用程序进行持续集成的示例。
你将设置一个工作流，在每次向 `main` 分支进行推送 (push) 或拉取请求 (pull request) 时运行共享测试，并为 Android、iOS 和桌面端构建构件。

本指南基于 [Jetcaster KMP 示例](https://github.com/kotlin-hands-on/jetcaster-kmp-migration/)。
你可以在[仓库中查看 action 和工作流配置](https://github.com/kotlin-hands-on/jetcaster-kmp-migration/tree/main/.github)，或者按照以下步骤查看分步说明。

本指南建议分两个部分设置 CI：

* [可重用的复合型 GitHub Action，用于设置 Java 和 Gradle](#create-a-composite-action-for-gradle-setup)
* [主 GitHub Actions 工作流](#define-the-build-workflow)，在每次向 `main` 分支推送或发起拉取请求时运行测试并触发特定平台的构建。

## 创建用于 Gradle 设置的复合型 action

创建一个[复合型 action (composite action)](https://docs.github.com/en/actions/tutorials/create-actions/create-a-composite-action)，以便在各个作业 (job) 之间同步 Java 和 Gradle 配置。
你将在工作流作业中重用此 action，以确保所有构建都使用相同的配置。

在此示例中，该 action 将安装 Java 17 并配置默认的 Gradle 版本。
要设置该 action，请创建文件 `.github/actions/gradle-setup/action.yml`：

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

## 定义构建工作流

定义工作流的运行时间并配置 Gradle 选项：

* 工作流应在每次向 `main` 分支推送或发起拉取请求时运行。
* Gradle 选项应禁用 Gradle daemon，并启用带缓存的并行执行。

使用基础配置创建文件 `.github/workflows/build.yml`：

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

通过此配置，你还可以使用 [workflow_dispatch](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow) 手动触发工作流。

现在你可以添加作业来运行测试并构建应用程序构件。

### 运行共享测试

此作业使用 `jvmTest` Gradle 任务运行测试，以便在为所有平台构建应用之前验证更改：

1. 检出要运行测试的仓库。
2. 使用你之前准备的复合型 `gradle-setup` action 来设置 Java 和 Gradle。
3. 使用 `./gradlew` 命令运行测试。
4. 将测试报告作为构件上传到 `**/build/reports/tests/` 目录。

要设置此作业，请将以下内容添加到 `.github/workflows/build.yml` 文件中：

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

测试运行完成后，工作流应开始构建应用程序构件。

### 构建 Android 调试包

此作业使用 `:mobile:assembleDebug` Gradle 任务构建 Android 调试版 APK：

1. 检出用于构建包的仓库。
2. 使用你之前准备的复合型 `gradle-setup` action 来设置 Java 和 Gradle。
3. 使用 `./gradlew` 命令构建 APK。
4. 从 `mobile/build/outputs/apk/debug/` 目录上传构建好的包。

将以下内容添加到 `.github/workflows/build.yml` 文件的 `jobs` 部分：

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

### 构建 iOS 模拟器应用程序

此作业针对 iOS 模拟器，以避免必须对应用进行正确签名。
该应用程序使用 `xcodebuild` 构建：

1. 检出用于构建应用程序的仓库。
2. 使用你之前准备的复合型 `gradle-setup` action 来设置 Java 和 Gradle。
3. 使用 `xcodebuild` 构建 iOS 应用程序 —— 该示例展示了 Jetcaster KMP 示例所使用的选项。
4. 将包含构建好的应用程序的文件夹（`build/Build/Products/Debug-iphonesimulator/*` 中的所有内容）作为构件上传。

iOS 应用程序在包含 `xcodebuild` 的 macOS 运行器 (`macos-latest`) 上构建。

继续修改 `.github/workflows/build.yml` 文件：

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

## 推送并测试你的 CI

当你将工作流配置推送到 `main` 分支或使用这些配置文件创建拉取请求时，CI 工作流将首次被触发。

你可以在仓库的 **Actions** 选项卡中查看工作流结果，以验证一切是否运行正常。

请记住，你也可以手动触发工作流：在左侧的操作列表中选择工作流，然后点击 **Run workflow**。

## 下一步

有关完整的 CI 配置示例，请参阅 [Jetcaster 示例](https://github.com/kotlin-hands-on/jetcaster-kmp-migration/tree/main/.github)，其中还包括为 macOS、Windows 和 Linux 构建桌面端 JVM 应用程序的作业。

有关使用 GitHub Actions 将应用程序发布到应用商店的指导，请参阅 [Marco Gomiero 关于该主题的系列文章](https://www.marcogomiero.com/posts/2024/kmp-ci-ios/)。