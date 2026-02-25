[//]: # (title: Kotlin Multiplatform アプリケーションの継続的インテグレーションに向けた GitHub Actions の設定)

<web-summary>GitHub Actions を使用して、Kotlin Multiplatform (KMP) アプリの継続的インテグレーション (CI/CD) を設定する方法を学びます。CI を使用して、iOS、Android、およびデスクトップ向けの共有テストの実行とアーティファクトのビルドを行います。</web-summary>

このガイドでは、GitHub Actions で設定された Kotlin Multiplatform アプリケーションの継続的インテグレーションの例を紹介します。
`main` ブランチへのプッシュまたはプルリクエストごとに、共有テストを実行し、Android、iOS、およびデスクトップ向けのアーティファクトをビルドするワークフローを設定します。

このガイドは [Jetcaster KMP サンプル](https://github.com/kotlin-hands-on/jetcaster-kmp-migration/) に基づいています。
[リポジトリ内のアクションとワークフローの設定](https://github.com/kotlin-hands-on/jetcaster-kmp-migration/tree/main/.github) を確認するか、以下の手順に従ってステップバイステップの説明を確認してください。

このガイドでは、CI を次の 2 つの部分で設定することを提案しています：

* [Java と Gradle をセットアップする再利用可能なコンポジット GitHub Action](#create-a-composite-action-for-gradle-setup)
* `main` ブランチへのプッシュまたはプルリクエストごとにテストを実行し、プラットフォーム固有のビルドをトリガーする [メインの GitHub Actions ワークフロー](#define-the-build-workflow)

## Gradle セットアップ用のコンポジットアクションを作成する

Java と Gradle の設定をジョブ間で同期させるために、[コンポジットアクション](https://docs.github.com/en/actions/tutorials/create-actions/create-a-composite-action) を作成します。
すべてのビルドで同じ設定が使用されるように、このアクションをワークフローのジョブで再利用します。

この例では、アクションは Java 17 をインストールし、デフォルトの Gradle バージョンを設定します。
アクションを設定するには、ファイル `.github/actions/gradle-setup/action.yml` を作成します：

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

ワークフローがいつ実行されるかを定義し、Gradle オプションを設定します：

* ワークフローは、`main` ブランチへのプッシュまたはプルリクエストごとに実行される必要があります。
* Gradle オプションでは、Gradle デーモンを無効にし、キャッシュを使用した並列実行を有効にする必要があります。

ベースとなる設定でファイル `.github/workflows/build.yml` を作成します：

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

この設定により、[workflow_dispatch](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow) を使用してワークフローを手動でトリガーすることもできます。

これで、テストを実行し、アプリケーションのアーティファクトをビルドするためのジョブを追加できます。

### 共有テストの実行

このジョブは、`jvmTest` Gradle タスクを使用してテストを実行し、すべてのプラットフォーム向けにアプリをビルドする前に変更を検証します：

1. テストを実行するリポジトリをチェックアウトします。
2. 先ほど準備したコンポジット `gradle-setup` アクションを使用して、Java と Gradle をセットアップします。
3. `./gradlew` コマンドでテストを実行します。
4. テストレポートをアーティファクトとして `**/build/reports/tests/` ディレクトリにアップロードします。

このジョブを設定するには、`.github/workflows/build.yml` ファイルに以下を追加します：

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

### Android デバッグパッケージのビルド

このジョブは、`:mobile:assembleDebug` Gradle タスクを使用して Android デバッグ APK をビルドします：

1. パッケージをビルドするリポジトリをチェックアウトします。
2. 先ほど準備したコンポジット `gradle-setup` アクションを使用して、Java と Gradle をセットアップします。
3. `./gradlew` コマンドで APK をビルドします。
4. ビルドされたパッケージを `mobile/build/outputs/apk/debug/` ディレクトリからアップロードします。

`.github/workflows/build.yml` ファイルの `jobs` セクションの続きに以下を追加します：

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

### iOS シミュレーターアプリケーションのビルド

このジョブは、アプリに適切に署名する必要を避けるために iOS シミュレーターをターゲットにします。
アプリケーションは `xcodebuild` を使用してビルドされます：

1. アプリケーションをビルドするリポジトリをチェックアウトします。
2. 先ほど準備したコンポジット `gradle-setup` アクションを使用して、Java と Gradle をセットアップします。
3. `xcodebuild` を使用して iOS アプリケーションをビルドします。この例では Jetcaster KMP サンプルで使用されているオプションを示しています。
4. ビルドされたアプリケーションを含むフォルダ（`build/Build/Products/Debug-iphonesimulator/*` 内のすべて）をアーティファクトとしてアップロードします。

iOS アプリケーションは、`xcodebuild` を含む macOS ランナー (`macos-latest`) 上でビルドされます。

`.github/workflows/build.yml` ファイルの編集を続けます：

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

## CI のプッシュとテスト

CI ワークフローは、ワークフロー設定を `main` ブランチにプッシュするか、これらの設定ファイルを含むプルリクエストを作成したときに、初めてトリガーされます。

リポジトリの **Actions** タブでワークフローの結果を確認し、すべてが正しく動作しているか検証できます。

ワークフローを手動でトリガーすることもできることを覚えておいてください。左側のアクション一覧でワークフローを選択し、**Run workflow** をクリックします。

## 次のステップ

完全な CI 設定の例については、[Jetcaster サンプル](https://github.com/kotlin-hands-on/jetcaster-kmp-migration/tree/main/.github) を参照してください。
これには、macOS、Windows、Linux 向けのデスクトップ JVM アプリケーションをビルドするジョブも含まれています。

GitHub Actions を使用してアプリストアにアプリケーションを公開する手順については、[Marco Gomiero によるこの主題に関する一連の投稿](https://www.marcogomiero.com/posts/2024/kmp-ci-ios/) を参照してください。