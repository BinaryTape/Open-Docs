[//]: # (title: 为 Kotlin Multiplatform 应用程序的持续集成配置 GitHub Actions)

<web-summary>了解如何使用 GitHub Actions 为 Kotlin Multiplatform (KMP) 应用设置持续集成 (CI/CD)。使用 CI 运行共享测试并为 iOS、Android 和桌面端构建工件。</web-summary>

本指南展示了为使用 GitHub Actions 设置的 Kotlin Multiplatform 应用程序进行持续集成的示例。
您将设置一个工作流，在每次向 `main` 分支进行推送或提交拉取请求 (PR) 时，运行共享测试并为 Android、iOS 和桌面端构建工件。

本指南基于 [Jetcaster KMP 示例](https://github.com/kotlin-hands-on/jetcaster-kmp-migration/)。
您可以查看 [仓库中的操作和工作流配置](https://github.com/kotlin-hands-on/jetcaster-kmp-migration/tree/main/.github)，或按照以下步骤进行分步说明。

本指南建议分两部分设置 CI：

* [用于设置 Java 和 Gradle 的可重用复合 GitHub Action](#create-a-composite-action-for-gradle-setup)
* [主 GitHub Actions 工作流](#define-the-build-workflow)，在每次向 `main` 分支进行推送或提交拉取请求 (PR) 时运行测试并触发特定平台的构建。

## 创建用于 Gradle 设置的复合操作

创建一个 [复合操作](https://docs.github.com/en/actions/tutorials/create-actions/create-a-composite-action) 以在作业之间同步 Java 和 Gradle 配置。
您将在工作流作业中重复使用此操作，以确保所有构建都使用相同的配置。

在此示例中，该操作安装 Java 17 并配置默认 Gradle 版本。
要设置该操作，请创建文件 `.github/actions/gradle-setup/action.yml`：

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

定义工作流何时运行并配置 Gradle 选项：

* 工作流应在每次向 `main` 分支进行推送或提交拉取请求 (PR) 时运行。
* Gradle 选项应禁用 Gradle 守护进程并启用带缓存的并行执行。

创建具有基础配置的文件 `.github/workflows/build.yml`：

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

通过此配置，您还可以使用 [workflow_dispatch](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow) 手动触发工作流。

现在您可以添加作业来运行测试并构建应用工件。

### 运行共享测试

此作业使用 `jvmTest` Gradle 任务运行测试，在为所有平台构建应用之前验证更改：

1. 检出要运行测试的仓库。
2. 使用您之前准备的复合 `gradle-setup` 操作来设置 Java 和 Gradle。
3. 使用 `./gradlew` 命令运行测试。
4. 将测试报告作为工件上传到 `**/build/reports/tests/` 目录。

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

一旦运行了测试，工作流就应该开始构建应用程序工件。

### 构建 Android 调试包

此作业使用 `:mobile:assembleDebug` Gradle 任务构建 Android 调试 APK：

1. 检出要从中构建包的仓库。
2. 使用您之前准备的复合 `gradle-setup` 操作来设置 Java 和 Gradle。
3. 使用 `./gradlew` 命令构建 APK。
4. 从 `mobile/build/outputs/apk/debug/` 目录上传构建好的包。

将以下内容添加到 `.github/workflows/build.yml` 文件的 `jobs` 部分后面：

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

### 构建 iOS 模拟器应用

此作业以 iOS 模拟器为目标，以避免必须对应用进行正确签名。
该应用使用 `xcodebuild` 进行构建：

1. 检出要从中构建应用的仓库。
2. 使用您之前准备的复合 `gradle-setup` 操作来设置 Java 和 Gradle。
3. 使用 `xcodebuild` 构建 iOS 应用 —— 该示例显示了用于 Jetcaster KMP 示例的选项。
4. 将包含构建好的应用的文件夹（`build/Build/Products/Debug-iphonesimulator/*` 中的所有内容）作为工件上传。

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

## 推送并测试您的 CI

当您将工作流配置推送到 `main` 分支或使用这些配置文件创建拉取请求 (PR) 时，CI 工作流将首次触发。

您可以在仓库的 **Actions** 选项卡中查看工作流结果，以验证一切是否正常运行。

请记住，您也可以手动触发工作流：在左侧的操作列表中选择工作流，然后点击 **Run workflow**。

## 下一步

有关完整的 CI 配置示例，请参阅 [Jetcaster 示例](https://github.com/kotlin-hands-on/jetcaster-kmp-migration/tree/main/.github)，该示例还包含为 macOS、Windows 和 Linux 构建桌面 JVM 应用程序的作业。

有关使用 GitHub Actions 向应用商店发布应用的指南，请参阅 [Marco Gomiero 关于该主题的系列文章](https://www.marcogomiero.com/posts/2024/kmp-ci-ios/)。