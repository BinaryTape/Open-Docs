[//]: # (title: マルチプラットフォームライブラリの公開設定)

マルチプラットフォームライブラリの公開は、様々な場所に対して設定できます。

*   [ローカルMavenリポジトリへ](#publishing-to-a-local-maven-repository)
*   Maven Centralリポジトリへ。アカウント認証情報の設定、ライブラリメタデータのカスタマイズ、公開プラグインの構成方法については、[こちらのチュートリアル](multiplatform-publish-libraries.md)を参照してください。
*   GitHubリポジトリへ。詳細は、GitHubの[GitHub Packages](https://docs.github.com/en/packages)に関するドキュメントを参照してください。

## ローカルMavenリポジトリへの公開

`maven-publish` Gradleプラグインを使用すると、マルチプラットフォームライブラリをローカルMavenリポジトリに公開できます。

1.  `shared/build.gradle.kts`ファイルに、[`maven-publish` Gradleプラグイン](https://docs.gradle.org/current/userguide/publishing_maven.html)を追加します。
2.  ライブラリのグループとバージョン、および公開する[リポジトリ](https://docs.gradle.org/current/userguide/publishing_maven.html#publishing_maven:repositories)を指定します。

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

`maven-publish`と組み合わせて使用すると、Kotlinプラグインは現在のホストでビルド可能な各ターゲットに対して自動的に公開物を作成します。ただし、Androidターゲットは[公開を設定するための追加の手順](#publish-an-android-library)が必要です。

## 公開物の構造

Kotlinマルチプラットフォームライブラリの公開物には、複数のMaven公開物が含まれており、それぞれが特定のターゲットに対応しています。さらに、ライブラリ全体を表す傘となる_root_公開物である`kotlinMultiplatform`も公開されます。

[依存関係](multiplatform-add-dependencies.md)として共通ソースセットに追加すると、root公開物は適切なプラットフォーム固有のアーティファクトに自動的に解決されます。

### ターゲット固有およびroot公開物

KotlinマルチプラットフォームGradleプラグインは、各ターゲットに対して個別の公開物を構成します。
以下のプロジェクト構成を考えてみましょう。

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

この設定により、以下のMaven公開物が生成されます。

**ターゲット固有の公開物**

*   `jvm`ターゲットの場合:`test:lib-jvm:1.0`
*   `iosX64`ターゲットの場合: `test:lib-iosx64:1.0`
*   `iosArm64`ターゲットの場合:`test:lib-iosarm64:1.0`

各ターゲット固有の公開物は独立しています。たとえば、`publishJvmPublicationTo<MavenRepositoryName>`を実行すると、JVMモジュールのみが公開され、他のモジュールは未公開のままになります。

**Root公開物**

`kotlinMultiplatform` root公開物: `test:lib:1.0`。

root公開物は、すべてのターゲット固有の公開物を参照するエントリポイントとして機能します。
メタデータアーティファクトを含み、他の公開物（個々のプラットフォームアーティファクトの期待されるURLと座標）への参照を含めることで、適切な依存関係の解決を保証します。

*   Maven Centralなど一部のリポジトリでは、rootモジュールに分類子 (classifier) のないJARアーティファクト（例: `kotlinMultiplatform-1.0.jar`）が含まれている必要があります。Kotlinマルチプラットフォームプラグインは、必要なアーティファクトを埋め込まれたメタデータアーティファクトとともに自動的に生成します。これにより、リポジトリの要件を満たすためにライブラリのrootモジュールに空のアーティファクトを追加する必要がなくなります。

    > JARアーティファクトの生成については、[Gradle](multiplatform-configure-compilations.md#compilation-for-jvm)と[Maven](https://kotlinlang.org/docs/maven.html#create-jar-file)のビルドシステムで詳細を確認してください。
    >
    {style="tip"}

*   リポジトリが必要とする場合、`kotlinMultiplatform`公開物にもソースとドキュメントのアーティファクトが必要になることがあります。その場合は、公開のスコープで[`artifact()`](https://docs.gradle.org/current/javadoc/org/gradle/api/publish/maven/MavenPublication.html#artifact-java.lang.Object-)を使用します。

### 完全なライブラリの公開

必要なすべてのアーティファクトを1つのステップで公開するには、`publishAllPublicationsTo<MavenRepositoryName>`という傘となるタスクを使用します。例:

```bash
./gradlew publishAllPublicationsToGithubPackagesRepository
```

Maven Localに公開する場合は、特別なタスクを使用できます。

```bash
./gradlew publishToMavenLocal
```

これらのタスクは、すべてのターゲット固有およびroot公開物が一緒に公開されることを保証し、ライブラリを依存関係の解決に完全に利用できるようにします。

または、個別の公開タスクを使用することもできます。まずroot公開を実行します。

```bash
./gradlew publishKotlinMultiplatformPublicationToMavenLocal
````

このタスクは、ターゲット固有の公開に関する情報を含む`*.module`ファイルを公開しますが、ターゲット自体は未公開のままです。プロセスを完了するには、各ターゲット固有の公開物を個別に公開します。

```bash
./gradlew publish<TargetName>PublicationToMavenLocal
```

これにより、すべてのアーティファクトが利用可能で、正しく参照されることが保証されます。

## ホストの要件

Kotlin/Nativeはクロスコンパイルをサポートしており、どのホストでも必要な`.klib`アーティファクトを生成できます。
ただし、いくつか留意すべき具体的な点があります。

**Appleターゲットのコンパイル**

Appleターゲットを含むプロジェクトのアーティファクトを生成するには、任意のホストを使用できます。
ただし、以下の場合はMacマシンを使用する必要があります。

*   ライブラリまたは依存モジュールに[cinterop依存関係](https://kotlinlang.org/docs/native-c-interop.html)がある場合。
*   プロジェクトで[CocoaPods連携](multiplatform-cocoapods-overview.md)が設定されている場合。
*   Appleターゲットの[最終バイナリ](multiplatform-build-native-binaries.md)をビルドまたはテストする必要がある場合。

**公開物の重複**

公開時の問題を避けるため、リポジトリでの公開物の重複を避けるために、すべてのアーティファクトを単一のホストから公開してください。例えば、Maven Centralは公開物の重複を明示的に禁止しており、プロセスは失敗します。

## Androidライブラリの公開

Androidライブラリを公開するには、追加の構成が必要です。

デフォルトでは、Androidライブラリのアーティファクトは公開されません。一連のAndroid [ビルドバリアント](https://developer.android.com/build/build-variants)によって生成されたアーティファクトを公開するには、`shared/build.gradle.kts`ファイルのAndroidターゲットブロックでバリアント名を指定します。

```kotlin
kotlin {
    androidTarget {
        publishLibraryVariants("release")
    }
}
```

この例は、[プロダクトフレーバー](https://developer.android.com/build/build-variants#product-flavors)を持たないAndroidライブラリで機能します。
プロダクトフレーバーを持つライブラリの場合、バリアント名には`fooBarDebug`や`fooBarRelease`のようなフレーバーも含まれます。

デフォルトの公開設定は以下のとおりです。
*   公開されるバリアントが同じビルドタイプ（例えば、すべて`release`または`debug`）の場合、それらはどのコンシューマビルドタイプとも互換性があります。
*   公開されるバリアントが異なるビルドタイプの場合、公開されたバリアントに含まれないコンシューマビルドタイプと互換性があるのはリリースバリアントのみです。他のすべてのバリアント（`debug`など）は、コンシューマプロジェクトが[マッチングフォールバック](https://developer.android.com/reference/tools/gradle-api/4.2/com/android/build/api/dsl/BuildType)を指定しない限り、コンシューマ側で同じビルドタイプにのみ一致します。

公開されるAndroidバリアントすべてを、ライブラリコンシューマが使用する同じビルドタイプのみと互換性を持たせたい場合は、このGradleプロパティを設定します: `kotlin.android.buildTypeAttribute.keep=true`。

プロダクトフレーバーごとにバリアントをグループ化して公開することもできます。これにより、異なるビルドタイプの出力が単一のモジュールに配置され、ビルドタイプがアーティファクトの分類子 (classifier) になります（リリースビルドタイプは引き続き分類子なしで公開されます）。このモードはデフォルトで無効になっており、`shared/build.gradle.kts`ファイルで次のように有効にできます。

```kotlin
kotlin {
    androidTarget {
        publishLibraryVariantsGroupedByFlavor = true
    }
}
```

> 異なる依存関係を持つ場合にプロダクトフレーバーごとにバリアントをグループ化して公開することは推奨されません。それらの依存関係は1つの依存関係リストにマージされるためです。
>
{style="note"}

## ソース公開の無効化

デフォルトでは、KotlinマルチプラットフォームGradleプラグインは、指定されたすべてのターゲットのソースを公開します。しかし、`shared/build.gradle.kts`ファイルで`withSourcesJar()` APIを使用してソース公開を設定し、無効にすることができます。

*   すべてのターゲットのソース公開を無効にする場合:

    ```kotlin
    kotlin {
        withSourcesJar(publish = false)

        jvm()
        linuxX64()
    }
    ```

*   指定されたターゲットのみのソース公開を無効にする場合:

    ```kotlin
    kotlin {
         // JVMのみソース公開を無効にする:
        jvm {
            withSourcesJar(publish = false)
        }
        linuxX64()
    }
    ```

*   指定されたターゲット以外のすべてのターゲットのソース公開を無効にする場合:

    ```kotlin
    kotlin {
        // JVM以外のすべてのターゲットでソース公開を無効にする:
        withSourcesJar(publish = false)

        jvm {
            withSourcesJar(publish = true)
        }
        linuxX64()
    }
    ```

## JVM環境属性公開の無効化

Kotlin 2.0.0以降、Gradle属性[`org.gradle.jvm.environment`](https://docs.gradle.org/current/userguide/variant_attributes.html#sub:jvm_default_attributes)は、KotlinマルチプラットフォームライブラリのJVMバリアントとAndroidバリアントを区別するために、すべてのKotlinバリアントとともに自動的に公開されます。この属性は、どのライブラリバリアントがどのJVM環境に適しているかを示し、Gradleはこの情報を使用してプロジェクトの依存関係の解決を助けます。ターゲット環境は「android」、「standard-jvm」、または「no-jvm」になります。

この属性の公開を無効にするには、`gradle.properties`ファイルに以下のGradleプロパティを追加します。

```none
kotlin.publishJvmEnvironmentAttribute=false
```

## ライブラリのプロモーション

あなたのライブラリは、[JetBrainsの検索プラットフォーム](https://klibs.io/)で紹介される可能性があります。これは、ターゲットプラットフォームに基づいてKotlinマルチプラットフォームライブラリを簡単に検索できるように設計されています。

条件を満たすライブラリは自動的に追加されます。ライブラリを追加する方法の詳細については、[FAQ](https://klibs.io/faq)を参照してください。

## 次のステップ

*   [KotlinマルチプラットフォームライブラリをMaven Centralリポジトリに公開する方法を学ぶ](multiplatform-publish-libraries.md)
*   [Kotlinマルチプラットフォーム向けのライブラリ設計に関するベストプラクティスとヒントについては、ライブラリ作成者向けガイドラインを参照する](https://kotlinlang.org/docs/api-guidelines-build-for-multiplatform.html)