[//]: # (title: Kotlin Multiplatformアプリケーションの継続的インテグレーションに向けたGitHub Actionsの設定)

<web-summary>GitHub Actionsを使用して、Kotlin Multiplatform (KMP) アプリの継続的インテグレーション (CI/CD) を設定する方法を学びます。
CIを使用して、共通テストの実行や、iOS、Android、デスクトップ向けのアーティファクトのビルドを行います。</web-summary>

このガイドでは、GitHub Actionsを使用して設定されたKotlin Multiplatformアプリケーションの継続的インテグレーション（CI）の例を紹介します。
`main` ブランチへのプッシュまたはプルリクエストのたびに、共通テストを実行し、Android、iOS、デスクトップ向けのアーティファクトをビルドするワークフローを設定します。

このガイドは、[Jetcaster KMP サンプル](https://github.com/kotlin-hands-on/jetcaster-kmp-migration/)に基づいています。
[リポジトリ内のアクションとワークフローの設定](https://github.com/kotlin-hands-on/jetcaster-kmp-migration/tree/main/.github)を確認するか、以下の手順に従ってステップバイステップの説明を確認してください。

このガイドでは、CIを2つのパートに分けて設定することを提案しています。

* [JavaとGradleをセットアップする再利用可能な複合アクション（Composite Action）](#create-a-composite-action-for-gradle-setup)
* `main` ブランチへのプッシュまたはプルリクエストのたびにテストを実行し、プラットフォーム固有のビルドをトリガーする[メインのGitHub Actionsワークフロー](#define-the-build-workflow)

## Gradleセットアップ用の複合アクションを作成する

ジョブ間でJavaとGradleの設定を同期させるために、[複合アクション（Composite Action）](https://docs.github.com/en/actions/tutorials/create-actions/create-a-composite-action)を作成します。
このアクションをワークフローのジョブで再利用することで、すべてのビルドで同じ設定が使用されるようになります。

この例では、アクションはJava 17をインストールし、デフォルトのGradleバージョンを構成します。
アクションをセットアップするには、`.github/actions/gradle-setup/action.yml` ファイルを作成します。

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

## ビルドワークフローを定義する

ワークフローがいつ実行されるかを定義し、Gradleのオプションを設定します。

* ワークフローは、`main` ブランチへのプッシュまたはプルリクエストのたびに実行される必要があります。
* Gradleのオプションでは、Gradleデーモンを無効にし、キャッシュを利用した並列実行を有効にする必要があります。

基本設定を含む `.github/workflows/build.yml` ファイルを作成します。

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

この設定により、[workflow_dispatch](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow) を使用して手動でワークフローをトリガーすることもできます。

これで、テストを実行してアプリケーションのアーティファクトをビルドするジョブを追加できます。

### 共通テストを実行する

このジョブは、`jvmTest` Gradleタスクを使用してテストを実行し、全プラットフォーム向けのアプリをビルドする前に変更を検証します。

1. テストを実行するリポジトリをチェックアウトします。
2. 前に準備した複合アクション `gradle-setup` を使用して、JavaとGradleをセットアップします。
3. `./gradlew` コマンドでテストを実行します。
4. テストレポートをアーティファクトとして `**/build/reports/tests/` ディレクトリにアップロードします。

このジョブをセットアップするには、以下の内容を `.github/workflows/build.yml` ファイルに追加します。

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

テストが実行されたら、ワークフローはアプリケーションのアーティファクトをビルドする必要があります。

### Androidデバッグパッケージをビルドする

このジョブは、`:mobile:assembleDebug` Gradleタスクを使用してAndroidデバッグAPKをビルドします。

1. パッケージをビルドするリポジトリをチェックアウトします。
2. 前に準備した複合アクション `gradle-setup` を使用して、JavaとGradleをセットアップします。
3. `./gradlew` コマンドでAPKをビルドします。
4. `mobile/build/outputs/apk/debug/` ディレクトリからビルドされたパッケージをアップロードします。

`jobs` セクションに続けて、以下の内容を `.github/workflows/build.yml` ファイルに追加します。

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

### iOSシミュレーターアプリケーションをビルドする

このジョブは、アプリへの適切な署名を避けるために、iOSシミュレーターをターゲットにします。
アプリケーションは `xcodebuild` を使用してビルドされます。

1. アプリケーションをビルドするリポジトリをチェックアウトします。
2. 前に準備した複合アクション `gradle-setup` を使用して、JavaとGradleをセットアップします。
3. `xcodebuild` を使用してiOSアプリケーションをビルドします。例では、Jetcaster KMPサンプルで使用されているオプションを示しています。
4. ビルドされたアプリケーションが含まれるフォルダ（`build/Build/Products/Debug-iphonesimulator/*` 内のすべて）をアーティファクトとしてアップロードします。

iOSアプリケーションは、`xcodebuild` を含むmacOSランナー（`macos-latest`）上でビルドされます。

`.github/workflows/build.yml` ファイルの編集を続けます。

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

## CIをプッシュしてテストする

CIワークフローは、ワークフロー設定を `main` ブランチにプッシュするか、これらの設定ファイルを含むプルリクエストを作成したときに初めてトリガーされます。

リポジトリの **Actions** タブでワークフローの結果を確認し、すべてが正しく動作することを確認できます。

ワークフローを手動でトリガーすることもできることを覚えておいてください。左側のアクション一覧からワークフローを選択し、**Run workflow** をクリックします。

## 次のステップ

完全なCI設定の例については、[Jetcaster サンプル](https://github.com/kotlin-hands-on/jetcaster-kmp-migration/tree/main/.github)を参照してください。これには、macOS、Windows、Linux向けのデスクトップJVMアプリケーションをビルドするジョブも含まれています。

GitHub Actionsを使用してアプリストアにアプリケーションを公開する手順については、[Marco Gomiero氏によるこの件に関する一連の投稿](https://www.marcogomiero.com/posts/2024/kmp-ci-ios/)を参照してください。