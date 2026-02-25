[//]: # (title: 為 Kotlin Multiplatform 應用程式設定 GitHub Actions 持續整合)

<web-summary>了解如何使用 GitHub Actions 為 Kotlin Multiplatform (KMP) 應用程式設定持續整合 (CI/CD)。使用 CI 執行共享測試，並為 iOS、Android 與桌面平台產生建置產物。</web-summary>

本指南展示了使用 GitHub Actions 設定 Kotlin Multiplatform 應用程式持續整合的範例。您將設定一個工作流程，在每次推送或對 `main` 分支提出提取要求 (PR) 時，執行共享測試並為 Android、iOS 與桌面平台產生建置產物。

本指南是以 [Jetcaster KMP 範例](https://github.com/kotlin-hands-on/jetcaster-kmp-migration/) 為基礎。您可以查看 [存儲庫中的操作與工作流程配置](https://github.com/kotlin-hands-on/jetcaster-kmp-migration/tree/main/.github)，或按照以下步驟進行逐步說明。

本指南建議分兩個部分設定 CI：

*   [用於設定 Java 與 Gradle 的可重複使用複合 GitHub Action](#create-a-composite-action-for-gradle-setup)
*   [主要 GitHub Actions 工作流程](#define-the-build-workflow)，在每次推送或對 `main` 分支提出提取要求時，執行測試並觸發特定平台的組建。

## 為 Gradle 設定建立複合操作

建立一個 [複合操作](https://docs.github.com/en/actions/tutorials/create-actions/create-a-composite-action) 以在不同工作 (job) 之間同步 Java 與 Gradle 設定。您將在工作流程的工作中重複使用此操作，以確保所有組建皆使用相同的設定。

在此範例中，該操作會安裝 Java 17 並設定預設的 Gradle 版本。要設定此操作，請建立檔案 `.github/actions/gradle-setup/action.yml`：

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

## 定義組建工作流程

定義工作流程的執行時機並設定 Gradle 選項：

*   工作流程應在每次推送或對 `main` 分支提出提取要求時執行。
*   Gradle 選項應停用 Gradle 精靈 (daemon) 並啟用具備快取的平行執行。

使用基礎配置建立 `.github/workflows/build.yml` 檔案：

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

透過此配置，您也可以使用 [workflow_dispatch](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow) 手動觸發工作流程。

現在您可以新增工作來執行測試並產生應用程式建置產物。

### 執行共享測試

此工作使用 `jvmTest` Gradle 任務執行測試，以便在為所有平台組建應用程式之前驗證變更：

1.  檢出要執行測試的存儲庫。
2.  使用先前準備的 `gradle-setup` 複合操作來設定 Java 與 Gradle。
3.  使用 `./gradlew` 指令執行測試。
4.  將測試報告作為建置產物上傳至 `**/build/reports/tests/` 目錄。

要設定此工作，請將以下內容新增至 `.github/workflows/build.yml` 檔案：

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

測試執行完畢後，工作流程應組建應用程式建置產物。

### 組建 Android 偵錯套件

此工作使用 `:mobile:assembleDebug` Gradle 任務組建 Android 偵錯 APK：

1.  檢出要組建套件的存儲庫。
2.  使用先前準備的 `gradle-setup` 複合操作來設定 Java 與 Gradle。
3.  使用 `./gradlew` 指令組建 APK。
4.  從 `mobile/build/outputs/apk/debug/` 目錄上傳組建好的套件。

將以下內容新增至 `.github/workflows/build.yml` 檔案的 `jobs` 區段：

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

### 組建 iOS 模擬器應用程式

此工作以 iOS 模擬器為目標，以避免必須對應用程式進行正式簽署。應用程式是使用 `xcodebuild` 組建的：

1.  檢出要組建應用程式的存儲庫。
2.  使用先前準備的 `gradle-setup` 複合操作來設定 Java 與 Gradle。
3.  使用 `xcodebuild` 組建 iOS 應用程式 —— 此範例展示了用於 Jetcaster KMP 範例的選項。
4.  將包含組建好的應用程式資料夾（`build/Build/Products/Debug-iphonesimulator/*` 內的所有內容）作為建置產物上傳。

iOS 應用程式是在包含 `xcodebuild` 的 macOS 執行器 (`macos-latest`) 上組建的。

繼續修改 `.github/workflows/build.yml` 檔案：

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

## 推送並測試您的 CI

當您將工作流程配置推送到 `main` 分支，或使用這些配置檔案建立提取要求時，CI 工作流程將首次觸發。

您可以查看存儲庫中 **Actions** 標籤頁的結果，以驗證一切是否正常運作。

請記住，您也可以手動觸發工作流程：在左側的操作清單中選取該工作流程，然後點擊 **Run workflow**。

## 後續步驟

有關完整的 CI 配置範例，請參閱 [Jetcaster 範例](https://github.com/kotlin-hands-on/jetcaster-kmp-migration/tree/main/.github)，該範例還包含為 macOS、Windows 與 Linux 組建桌面 JVM 應用程式的工作。

有關使用 GitHub Actions 將應用程式發佈到應用程式商店的指引，請參閱 [Marco Gomiero 關於該主題的系列文章](https://www.marcogomiero.com/posts/2024/kmp-ci-ios/)。