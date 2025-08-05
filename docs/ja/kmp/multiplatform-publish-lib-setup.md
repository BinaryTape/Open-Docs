[//]: # (title: マルチプラットフォームライブラリの公開設定)

マルチプラットフォームライブラリの公開をさまざまな場所へ設定できます:

*   [ローカルMavenリポジトリへ](#publishing-to-a-local-maven-repository)
*   Maven Centralリポジリへ。アカウント認証情報の設定、ライブラリメタデータのカスタマイズ、および公開プラグインの設定方法については、[こちらのチュートリアル](multiplatform-publish-libraries.md)を参照してください。
*   GitHubリポジトリへ。詳細については、GitHubの[GitHub Packages](https://docs.github.com/en/packages)に関するドキュメントを参照してください。

## ローカルMavenリポジリへの公開

マルチプラットフォームライブラリをローカルMavenリポジトリに公開するには、`maven-publish` Gradleプラグインを使用します。

1.  `shared/build.gradle.kts`ファイルで、[`maven-publish` Gradleプラグイン](https://docs.gradle.org/current/userguide/publishing_maven.html)を追加します。
2.  ライブラリのグループとバージョン、および公開先の[リポジトリ](https://docs.gradle.org/current/userguide/publishing_maven.html#publishing_maven:repositories)を指定します。

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

`maven-publish`と併用する場合、Kotlinプラグインは、現在のホストでビルド可能な各ターゲットに対して自動的に公開を作成します。ただし、Androidターゲットは、[公開を設定するための追加の手順](#publish-an-android-library)が必要です。

## 公開の構造

Kotlinマルチプラットフォームライブラリの公開には、複数のMaven公開が含まれ、それぞれが特定のターゲットに対応します。さらに、ライブラリ全体を表すアンブレラ (_root_) 公開である`kotlinMultiplatform`も公開されます。

共通ソースセットに[依存関係](multiplatform-add-dependencies.md)として追加されると、root公開は適切なプラットフォーム固有のアーティファクトに自動的に解決されます。

### ターゲット固有の公開とroot公開

KotlinマルチプラットフォームGradleプラグインは、各ターゲットに対して個別の公開を設定します。
以下のプロジェクト構成を考慮してください:

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

この設定により、以下のMaven公開が生成されます:

**ターゲット固有の公開**

*   `jvm`ターゲットの場合:`test:lib-jvm:1.0`
*   `iosX64`ターゲットの場合: `test:lib-iosx64:1.0`
*   `iosArm64`ターゲットの場合:`test:lib-iosarm64:1.0`

各ターゲット固有の公開は独立しています。たとえば、`publishJvmPublicationTo<MavenRepositoryName>`を実行すると、JVMモジュールのみが公開され、他のモジュールは未公開のままになります。

**Root公開**

`kotlinMultiplatform` root公開: `test:lib:1.0`。

root公開は、すべてのターゲット固有の公開を参照するエントリポイントとして機能します。
これはメタデータアーティファクトを含み、他の公開への参照 (個々のプラットフォームアーティファクトの期待されるURLと座標) を含めることで、適切な依存関係の解決を保証します。

*   Maven Centralのような一部のリポジトリでは、rootモジュールがclassifierなしのJARアーティファクト、たとえば`kotlinMultiplatform-1.0.jar`を含むことを要求します。Kotlinマルチプラットフォームプラグインは、組み込みのメタデータアーティファクトとともに、必要なアーティファクトを自動的に生成します。これは、リポジトリの要件を満たすために、ライブラリのrootモジュールに空のアーティファクトを追加する必要がないことを意味します。

    > [Gradle](multiplatform-configure-compilations.md#compilation-for-jvm)および[Maven](https://kotlinlang.org/docs/maven.html#create-jar-file)ビルドシステムでのJARアーティファクト生成について詳しく学びましょう。
    >
    {style="tip"}

*   `kotlinMultiplatform`公開は、リポジトリによって必要とされる場合、ソースおよびドキュメントアーティファクトも必要とする場合があります。その場合、公開のスコープで[`artifact()`](https://docs.gradle.org/current/javadoc/org/gradle/api/publish/maven/MavenPublication.html#artifact-java.lang.Object-)を使用してください。

### 完全なライブラリの公開

すべての必要なアーティファクトを一度に公開するには、`publishAllPublicationsTo<MavenRepositoryName>`アンブレラタスクを使用します。
例:

```bash
./gradlew publishAllPublicationsToGithubPackagesRepository
```

Maven Localに公開する場合、特別なタスクを使用できます:

```bash
./gradlew publishToMavenLocal
```

これらのタスクにより、すべてのターゲット固有の公開とroot公開が一緒に公開され、ライブラリが依存関係解決のために完全に利用可能になります。

あるいは、個別の公開タスクを使用することもできます。最初にroot公開を実行します:

```bash
./gradlew publishKotlinMultiplatformPublicationToMavenLocal
```

このタスクは、ターゲット固有の公開に関する情報を含む`*.module`ファイルを公開しますが、ターゲット自体は未公開のままです。プロセスを完了するには、各ターゲット固有の公開を個別に公開します:

```bash
./gradlew publish<TargetName>PublicationToMavenLocal
```

これにより、すべてのアーティファクトが利用可能で、正しく参照されることが保証されます。

## ホスト要件

Kotlin/Nativeはクロスコンパイルをサポートしており、任意のホストで必要な`.klib`アーティファクトを生成できます。
ただし、いくつか留意すべき特定の事項があります。

### Appleターゲットのコンパイル
<secondary-label ref="Experimental"/>

Appleターゲットを持つプロジェクトのアーティファクトを生成するには、通常、Appleマシンが必要です。
ただし、他のホストを使用したい場合は、`gradle.properties`ファイルでこのオプションを設定してください:

```none
kotlin.native.enableKlibsCrossCompilation=true
```

クロスコンパイルは現在Experimentalであり、いくつかの制限があります。以下の場合、引き続きMacマシンを使用する必要があります:

*   ライブラリに[cinteropの依存関係](https://kotlinlang.org/docs/native-c-interop.html)がある場合。
*   プロジェクトに[CocoaPodsの統合](multiplatform-cocoapods-overview.md)が設定されている場合。
*   Appleターゲットの[最終バイナリ](multiplatform-build-native-binaries.md)をビルドまたはテストする必要がある場合。

### 公開の重複

公開中の問題を避けるため、リポジトリ内での公開の重複を避けるために、すべてのアーティファクトを単一のホストから公開してください。例えば、Maven Centralは重複する公開を明確に禁止しており、そのプロセスは失敗します。
<!-- TBD: add the actual error -->

## Androidライブラリの公開

Androidライブラリを公開するには、追加の設定が必要です。

デフォルトでは、Androidライブラリのアーティファクトは公開されません。一連のAndroid [ビルドバリアント](https://developer.android.com/build/build-variants)によって生成されたアーティファクトを公開するには、`shared/build.gradle.kts`ファイルのAndroidターゲットブロックでバリアント名を指定します。

```kotlin
kotlin {
    androidTarget {
        publishLibraryVariants("release")
    }
}
```

この例は、[プロダクトフレーバー](https://developer.android.com/build/build-variants#product-flavors)のないAndroidライブラリで機能します。
プロダクトフレーバーを持つライブラリの場合、バリアント名には`fooBarDebug`や`fooBarRelease`のようなフレーバーも含まれます。

デフォルトの公開設定は以下の通りです:
*   公開されたバリアントが同じビルドタイプ（例: すべてが`release`または`debug`）の場合、それらは任意のコンシューマビルドタイプと互換性があります。
*   公開されたバリアントが異なるビルドタイプの場合、リリースバリアントのみが、公開されたバリアントに含まれないコンシューマビルドタイプと互換性があります。
*   その他のすべてのバリアント（`debug`など）は、コンシューマプロジェクトが[マッチングフォールバック](https://developer.android.com/reference/tools/gradle-api/4.2/com/android/build/api/dsl/BuildType)を指定しない限り、コンシューマ側の同じビルドタイプのみと一致します。

公開された各Androidバリアントを、ライブラリコンシューマが使用する同じビルドタイプとのみ互換性を持たせたい場合は、このGradleプロパティを設定します: `kotlin.android.buildTypeAttribute.keep=true`。

プロダクトフレーバーごとにバリアントをグループ化して公開することもできます。これにより、異なるビルドタイプの出力が単一のモジュールに配置され、ビルドタイプがアーティファクトのclassifierになります（リリースビルドタイプは引き続きclassifierなしで公開されます）。このモードはデフォルトで無効になっており、`shared/build.gradle.kts`ファイルで次のように有効にできます:

```kotlin
kotlin {
    androidTarget {
        publishLibraryVariantsGroupedByFlavor = true
    }
}
```

> 依存関係が異なる場合にプロダクトフレーバーごとにグループ化されたバリアントを公開することは推奨されません。それらは1つの依存関係リストにマージされるためです。
>
{style="note"}

## ソース公開の無効化

デフォルトでは、KotlinマルチプラットフォームGradleプラグインは、指定されたすべてのターゲットのソースを公開します。ただし、`shared/build.gradle.kts`ファイルで`withSourcesJar()` APIを使用してソース公開を設定および無効にすることができます。

*   すべてのターゲットのソース公開を無効にするには:

    ```kotlin
    kotlin {
        withSourcesJar(publish = false)

        jvm()
        linuxX64()
    }
    ```

*   指定されたターゲットのみのソース公開を無効にするには:

    ```kotlin
    kotlin {
         // Disable sources publication only for JVM:
        jvm {
            withSourcesJar(publish = false)
        }
        linuxX64()
    }
    ```

*   指定されたターゲットを除くすべてのターゲットのソース公開を無効にするには:

    ```kotlin
    kotlin {
        // Disable sources publication for all targets except for JVM:
        withSourcesJar(publish = false)

        jvm {
            withSourcesJar(publish = true)
        }
        linuxX64()
    }
    ```

## JVM環境属性の公開を無効にする

Kotlin 2.0.0以降、Gradle属性[`org.gradle.jvm.environment`](https://docs.gradle.org/current/userguide/variant_attributes.html#sub:jvm_default_attributes)は、KotlinマルチプラットフォームライブラリのJVMバリアントとAndroidバリアントを区別するために、すべてのKotlinバリアントとともに自動的に公開されます。この属性は、どのライブラリバリアントがどのJVM環境に適しているかを示し、Gradleはこの情報を使用してプロジェクトでの依存関係の解決を支援します。ターゲット環境は、"android"、"standard-jvm"、または"no-jvm"にすることができます。

この属性の公開を無効にするには、`gradle.properties`ファイルに以下のGradleプロパティを追加します:

```none
kotlin.publishJvmEnvironmentAttribute=false
```

## ライブラリのプロモーション

あなたのライブラリは、[JetBrainsの検索プラットフォーム](https://klibs.io/)に掲載されることがあります。
これは、ターゲットプラットフォームに基づいてKotlinマルチプラットフォームライブラリを簡単に検索できるように設計されています。

基準を満たすライブラリは自動的に追加されます。ライブラリの追加方法については、[FAQ](https://klibs.io/faq)を参照してください。

## 次のステップ

*   [KotlinマルチプラットフォームライブラリをMaven Centralリポジトリに公開する方法を学ぶ](multiplatform-publish-libraries.md)
*   [Kotlinマルチプラットフォーム向けライブラリ設計のベストプラクティスとヒントについては、ライブラリ作者向けガイドラインを参照](https://kotlinlang.org/docs/api-guidelines-build-for-multiplatform.html)