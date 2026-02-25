[//]: # (title: マルチプラットフォームライブラリ公開の設定)

マルチプラットフォームライブラリの公開先は、以下のさまざまな場所に設定できます：

* [ローカルMavenリポジトリ](#publishing-to-a-local-maven-repository)
* Maven Centralリポジトリ。アカウント資格情報の設定、ライブラリメタデータのカスタマイズ、および公開プラグインの設定方法については、[チュートリアル](multiplatform-publish-libraries.md)をご覧ください。
* GitHubリポジトリ。詳細については、GitHubの[GitHub Packages](https://docs.github.com/en/packages)に関するドキュメントを参照してください。

## ローカルMavenリポジトリへの公開

`maven-publish` Gradleプラグインを使用して、マルチプラットフォームライブラリをローカルMavenリポジトリに公開できます：

1. `shared/build.gradle.kts` ファイルに、[`maven-publish` Gradleプラグイン](https://docs.gradle.org/current/userguide/publishing_maven.html)を追加します。
2. ライブラリのグループ（group）とバージョン（version）、および公開先の[リポジトリ](https://docs.gradle.org/current/userguide/publishing_maven.html#publishing_maven:repositories)を指定します：

   ```kotlin
   plugins {
       // ...
       id("maven-publish")
   }

   group = "com.example"
   version = "1.0"

   publishing {
       repositories {
           maven {
               //...
           }
       }
   }
   ```

`maven-publish` と併用すると、Kotlinプラグインは、現在のホストでビルド可能な各ターゲットに対して公開物（Publication）を自動的に作成します。ただし、Androidターゲットについては、[公開を設定するための追加ステップ](#publish-an-android-library)が必要です。

## 公開物の構造

Kotlinマルチプラットフォームライブラリの公開物には、特定のターゲットごとに対応する複数のMaven公開物が含まれます。さらに、ライブラリ全体を表すアンブレラ「ルート（root）」公開物である `kotlinMultiplatform` も公開されます。

共通ソースセット（common source set）に[依存関係](multiplatform-add-dependencies.md)として追加されると、ルート公開物は自動的に適切なプラットフォーム固有のアーティファクトに解決されます。

### ターゲット固有の公開物とルート公開物

KotlinマルチプラットフォームGradleプラグインは、ターゲットごとに個別の公開物を設定します。
以下のプロジェクト構成を考えてみましょう：

```kotlin
// projectName = "lib"
group = "test"
version = "1.0"

kotlin {
    jvm()
    iosX64()
    iosArm64()
}
```

この構成では、以下のMaven公開物が生成されます：

**ターゲット固有の公開物**

* `jvm` ターゲット用：`test:lib-jvm:1.0`
* `iosX64` ターゲット用：`test:lib-iosx64:1.0`
* `iosArm64` ターゲット用：`test:lib-iosarm64:1.0`

各ターゲット固有の公開物は独立しています。例えば、`publishJvmPublicationTo<MavenRepositoryName>` を実行するとJVMモジュールのみが公開され、他のモジュールは公開されないままになります。

**ルート公開物**

`kotlinMultiplatform` ルート公開物：`test:lib:1.0`

ルート公開物は、すべてのターゲット固有の公開物を参照するエントリポイントとして機能します。これにはメタデータアーティファクトが含まれており、個々のプラットフォームアーティファクトの期待されるURLや座標（coordinates）など、他の公開物への参照を含めることで、適切な依存関係の解決を保証します。

* Maven Centralなどの一部のリポジトリでは、ルートモジュールにクラシファイアのないJARアーティファクト（例：`kotlinMultiplatform-1.0.jar`）を含める必要があります。Kotlinマルチプラットフォームプラグインは、必要なアーティファクトを埋め込みメタデータアーティファクトとともに自動的に生成します。つまり、リポジトリの要件を満たすためにライブラリのルートモジュールに空のアーティファクトを手動で追加する必要はありません。

  > [Gradle](multiplatform-configure-compilations.md#compilation-for-jvm) および [Maven](https://kotlinlang.org/docs/maven.html#create-jar-file) ビルドシステムでのJARアーティファクト生成についての詳細はこちらをご覧ください。
  >
  {style="tip"}

* リポジトリで要求される場合、`kotlinMultiplatform` 公開物にはソースやドキュメントのアーティファクトも必要になることがあります。その場合は、公開物のスコープ内で [`artifact()`](https://docs.gradle.org/current/javadoc/org/gradle/api/publish/maven/MavenPublication.html#artifact-java.lang.Object-) を使用してください。

### ライブラリ全体の公開

必要なすべてのアーティファクトを1ステップで公開するには、アンブレラタスクである `publishAllPublicationsTo<MavenRepositoryName>` を使用します。
例：

```bash
./gradlew publishAllPublicationsToGithubPackagesRepository
```

Maven Localに公開する場合は、特別なタスクを使用できます：

```bash
./gradlew publishToMavenLocal
```

これらのタスクにより、すべてのターゲット固有の公開物とルート公開物がまとめて公開され、ライブラリが依存関係の解決に完全に利用可能な状態になります。

あるいは、個別の公開タスクを使用することもできます。最初にルート公開を実行します：

```bash
./gradlew publishKotlinMultiplatformPublicationToMavenLocal
```

このタスクは、ターゲット固有の公開物に関する情報を含む `*.module` ファイルを公開しますが、ターゲット自体は公開されないままです。プロセスを完了するには、各ターゲット固有の公開物を個別に公開します：

```bash
./gradlew publish<TargetName>PublicationToMavenLocal
```

これにより、すべてのアーティファクトが利用可能になり、正しく参照されることが保証されます。

## ホストの要件

Kotlin/Nativeはクロスコンパイルをサポートしており、任意のホストで必要な `.klib` アーティファクトを生成できます。
ただし、留意すべきいくつかの制限があります。

### Appleターゲットのコンパイル

Appleターゲットを含むプロジェクトの場合、アーティファクトの生成には任意のホストを使用できます。
ただし、以下の場合には引き続きMacマシンを使用する必要があります：

* ライブラリまたは依存モジュールに [cinterop 依存関係](https://kotlinlang.org/docs/native-c-interop.html)がある場合。
* プロジェクトに [CocoaPods 統合](multiplatform-cocoapods-overview.md)が設定されている場合。
* Appleターゲット向けの[最終バイナリ](multiplatform-build-native-binaries.md)をビルドまたはテストする必要がある場合。

### 公開の重複の回避

リポジトリ内での公開の重複を避けるため、すべてのアーティファクトを単一のホストから公開してください。
例えば、Maven Centralは重複した公開を明示的に禁止しており、重複が作成されるとプロセスが失敗します。

## Androidライブラリの公開

Androidライブラリを公開するには、追加の設定が必要です。
デフォルトでは、Androidライブラリのアーティファクトは公開されません。

> このセクションでは、Android Gradle Libraryプラグインを使用していることを前提としています。
> プラグインの設定方法、または従来の `com.android.library` プラグインからの移行方法については、Androidドキュメントの [Set up the Android Gradle Library Plugin](https://developer.android.com/kotlin/multiplatform/plugin#migrate) ページを参照してください。
> 
{style="note"}

アーティファクトを公開するには、`shared/build.gradle.kts` ファイルに `androidLibrary {}` ブロックを追加し、KMP DSLを使用して公開を設定します。
例：

```kotlin
kotlin {
    androidLibrary {
        namespace = "org.example.library"
        compileSdk = libs.versions.android.compileSdk.get().toInt()
        minSdk = libs.versions.android.minSdk.get().toInt()

        // Javaコンパイルのサポートを有効にします。
        // Javaコンパイルが不要な場合にビルド時間を改善します。
        withJava()

        compilations.configureEach {
            compilerOptions.configure {
                jvmTarget.set(
                    JvmTarget.JVM_11
                )
            }
        }
    }
}
```

Android Gradle Libraryプラグインはプロダクトフレーバー（product flavors）やビルドバリアント（build variants）をサポートしておらず、構成を簡素化していることに注意してください。
その結果、テストソースセットと構成を作成するにはオプトイン（明示的な有効化）が必要です。例：

```kotlin
kotlin {
    androidLibrary {
        // ...

        // ホスト側（ユニット）テストを有効にして設定するためにオプトインします
        withHostTestBuilder {}.configure {}

        // ソースセット名を指定して、デバイス側のテストを有効にするためにオプトインします
        withDeviceTestBuilder {
            sourceSetTreeName = "test"
        }

        // ...
    }
}
```

以前は、例えばGitHubアクションでテストを実行する場合、debugとreleaseバリアントを個別に指定する必要がありました：

```yaml
- target: testDebugUnitTest
  os: ubuntu-latest
- target: testReleaseUnitTest
  os: ubuntu-latest
```

Android Gradle Libraryプラグインでは、ソースセット名を指定した一般的なターゲットのみを指定するだけで済みます：

```yaml
- target: testAndroidHostTest
  os: ubuntu-latest
```

## ソースの公開を無効にする

デフォルトでは、KotlinマルチプラットフォームGradleプラグインは指定されたすべてのターゲットのソース（sources）を公開します。しかし、`shared/build.gradle.kts` ファイルの `withSourcesJar()` APIを使用して、ソースの公開を設定したり無効にしたりできます。

* すべてのターゲットでソースの公開を無効にする：

  ```kotlin
  kotlin {
      withSourcesJar(publish = false)

      jvm()
      linuxX64()
  }
  ```

* 指定したターゲットのみでソースの公開を無効にする：

  ```kotlin
  kotlin {
       // JVMのみソースの公開を無効にする：
      jvm {
          withSourcesJar(publish = false)
      }
      linuxX64()
  }
  ```

* 指定したターゲット以外のすべてのターゲットでソースの公開を無効にする：

  ```kotlin
  kotlin {
      // JVM以外のすべてのターゲットでソースの公開を無効にする：
      withSourcesJar(publish = false)

      jvm {
          withSourcesJar(publish = true)
      }
      linuxX64()
  }
  ```

## JVM環境属性の公開を無効にする

Kotlin 2.0.0以降、Gradle属性 [`org.gradle.jvm.environment`](https://docs.gradle.org/current/userguide/variant_attributes.html#sub:jvm_default_attributes) がすべてのKotlinバリアントとともに自動的に公開されるようになり、KotlinマルチプラットフォームライブラリのJVMバリアントとAndroidバリアントを区別するのに役立ちます。この属性は、どのライブラリバリアントがどのJVM環境に適しているかを示し、Gradleはこの情報を使用してプロジェクト内の依存関係の解決を支援します。ターゲット環境は "android"、"standard-jvm"、または "no-jvm" のいずれかになります。

`gradle.properties` ファイルに以下のGradleプロパティを追加することで、この属性の公開を無効にできます：

```none
kotlin.publishJvmEnvironmentAttribute=false
```

## ライブラリを宣伝する

あなたのライブラリは、[JetBrainsのマルチプラットフォームライブラリカタログ](https://klibs.io/)に掲載される可能性があります。このカタログは、ターゲットプラットフォームに基づいてKotlinマルチプラットフォームライブラリを簡単に探せるように設計されています。

基準を満たすライブラリは自動的に追加されます。カタログにライブラリが表示されるようにするための詳細については、[FAQ](https://klibs.io/faq) を参照してください。

## 次のステップ

* [KotlinマルチプラットフォームライブラリをMaven Centralリポジトリに公開する方法を学ぶ](multiplatform-publish-libraries.md)
* [Kotlinマルチプラットフォーム向けライブラリ設計のベストプラクティスとヒントについては、ライブラリ作成者向けガイドラインを参照してください](https://kotlinlang.org/docs/api-guidelines-build-for-multiplatform.html)