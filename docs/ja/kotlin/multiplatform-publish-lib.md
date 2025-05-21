---
title: マルチプラットフォームライブラリの公開設定
---
マルチプラットフォームライブラリの公開先は、以下の場所に設定できます。

* [ローカルのMavenリポジトリへの公開](#publishing-to-a-local-maven-repository)
* Maven Centralリポジトリ。アカウントの認証情報の設定、ライブラリのメタデータのカスタマイズ、公開プラグインの設定方法については、[チュートリアル](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-libraries.html)を参照してください。
* GitHubリポジトリ。詳細については、GitHubのドキュメントの[GitHub packages](https://docs.github.com/en/packages)を参照してください。

## ローカルのMavenリポジトリへの公開

`maven-publish` Gradleプラグインを使用すると、マルチプラットフォームライブラリをローカルのMavenリポジトリに公開できます。

1. `shared/build.gradle.kts`ファイルに、[`maven-publish` Gradleプラグイン](https://docs.gradle.org/current/userguide/publishing_maven.html)を追加します。
2. ライブラリのグループとバージョン、および公開先の[リポジトリ](https://docs.gradle.org/current/userguide/publishing_maven.html#publishing_maven:repositories)を指定します。

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

`maven-publish`とともに使用すると、Kotlinプラグインは、現在のホストでビルドできる各ターゲットに対して自動的にパブリケーションを作成します。ただし、Androidターゲットは例外で、[公開を設定するための追加の手順](#publish-an-android-library)が必要です。

## パブリケーションの構造

マルチプラットフォームライブラリのパブリケーションには、ライブラリ全体を表す追加の_root_パブリケーション`kotlinMultiplatform`が含まれており、共通ソースセットへの依存関係として追加されると、適切なプラットフォーム固有のアーティファクトに自動的に解決されます。[依存関係の追加](multiplatform-add-dependencies)の詳細をご覧ください。

この`kotlinMultiplatform`パブリケーションには、メタデータアーティファクトが含まれており、他のパブリケーションをそのバリアントとして参照します。

:::note
Maven Centralなどの一部のリポジトリでは、ルートモジュールにclassifierなしのJARアーティファクト（`kotlinMultiplatform-1.0.jar`など）が含まれている必要があります。
Kotlin Multiplatformプラグインは、必要なアーティファクトを埋め込みメタデータアーティファクトとともに自動的に生成します。
これは、リポジトリの要件を満たすために、空のアーティファクトをライブラリのルートモジュールに追加してビルドをカスタマイズする必要がないことを意味します。

:::

`kotlinMultiplatform`パブリケーションには、リポジトリで必要な場合に、ソースおよびドキュメントアーティファクトも必要になる場合があります。その場合は、パブリケーションのスコープで[`artifact(...)`](https://docs.gradle.org/current/javadoc/org/gradle/api/publish/maven/MavenPublication.html#artifact-java.lang.Object-)を使用して、これらのアーティファクトを追加します。

## ホストの要件

Kotlin/Nativeはクロスコンパイルをサポートしており、どのホストでも必要な`.klib`アーティファクトを生成できます。
ただし、留意すべき点がいくつかあります。

### Appleターゲットのコンパイル

Appleターゲットを含むプロジェクトのアーティファクトを生成するには、通常、Appleマシンが必要です。
ただし、他のホストを使用する場合は、`gradle.properties`ファイルでこのオプションを設定します。

```none
kotlin.native.enableKlibsCrossCompilation=true
```

クロスコンパイルは現在試験的であり、いくつかの制限があります。次の場合、Macマシンを使用する必要があります。

* ライブラリに[cinterop依存関係](native-c-interop)がある。
* プロジェクトで[CocoaPodsの統合](native-cocoapods)が設定されている。
* Appleターゲットの[最終バイナリ](multiplatform-build-native-binaries)をビルドまたはテストする必要がある。

### パブリケーションの複製

公開中の問題を回避するには、リポジトリでのパブリケーションの複製を避けるため、単一のホストからすべてのアーティファクトを公開してください。たとえば、Maven Centralでは、パブリケーションの複製が明示的に禁止されており、プロセスが失敗します。
<!-- TBD: add the actual error -->

## Androidライブラリの公開

Androidライブラリを公開するには、追加の構成が必要です。

デフォルトでは、Androidライブラリのアーティファクトは公開されません。Androidの[ビルドバリアント](https://developer.android.com/build/build-variants)のセットによって生成されたアーティファクトを公開するには、`shared/build.gradle.kts`ファイルのAndroidターゲットブロックでバリアント名を指定します。

```kotlin
kotlin {
    androidTarget {
        publishLibraryVariants("release")
    }
}

```

この例は、[プロダクトフレーバー](https://developer.android.com/build/build-variants#product-flavors)のないAndroidライブラリで機能します。
プロダクトフレーバーのあるライブラリの場合、バリアント名には`fooBarDebug`や`fooBarRelease`のようにフレーバーも含まれます。

デフォルトの公開設定は次のとおりです。
* 公開されたバリアントに同じビルドタイプ（たとえば、すべて`release`または`debug`）がある場合、
  それらは任意のコンシューマーのビルドタイプと互換性があります。
* 公開されたバリアントに異なるビルドタイプがある場合、リリースバリアントのみが互換性を持つ
  コンシューマーのビルドタイプで、公開されたバリアントに含まれていないもの。他のすべてのバリアント（`debug`など）
  コンシューマープロジェクトが指定しない限り、コンシューマー側で同じビルドタイプのみに一致します
  [一致するフォールバック](https://developer.android.com/reference/tools/gradle-api/4.2/com/android/build/api/dsl/BuildType)。

公開されたすべてのAndroidバリアントを、ライブラリのコンシューマーが使用する同じビルドタイプとのみ互換性を持たせる場合は、
このGradleプロパティを設定します。`kotlin.android.buildTypeAttribute.keep=true`。

プロダクトフレーバーでグループ化されたバリアントを公開して、異なるビルドタイプの出力が配置されるようにすることもできます
単一のモジュールで、ビルドタイプはアーティファクトのclassifierになります（リリースビルドタイプはclassifierなしで公開されます）。このモードはデフォルトで無効になっており、`shared/build.gradle.kts`ファイルで次のように有効にできます。

```kotlin
kotlin {
    androidTarget {
        publishLibraryVariantsGroupedByFlavor = true
    }
}
```

:::note
依存関係が異なる場合に、プロダクトフレーバーでグループ化されたバリアントを公開することは推奨されません。
それらは1つの依存関係リストにマージされるためです。

:::

## ソース公開の無効化

デフォルトでは、Kotlin Multiplatform Gradleプラグインは、指定されたすべてのターゲットのソースを公開します。ただし、
`shared/build.gradle.kts`ファイルで`withSourcesJar()` APIを使用して、ソースの公開を構成および無効化できます。

* すべてのターゲットのソース公開を無効にするには：

  ```kotlin
  kotlin {
      withSourcesJar(publish = false)
  
      jvm()
      linuxX64()
  }
  ```

* 指定されたターゲットでのみソース公開を無効にするには：

  ```kotlin
  kotlin {
       // Disable sources publication only for JVM:
      jvm {
          withSourcesJar(publish = false)
      }
      linuxX64()
  }
  ```

* 指定されたターゲットを除くすべてのターゲットのソース公開を無効にするには：

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

Kotlin 2.0.0以降、Gradle属性[`org.gradle.jvm.environment`](https://docs.gradle.org/current/userguide/variant_attributes.html#sub:jvm_default_attributes)
は、Kotlin MultiplatformライブラリのJVMバリアントとAndroidバリアントを区別するために、すべてのKotlinバリアントとともに自動的に公開されます。属性は、どのライブラリバリアントがどのJVM環境に適しているかを示し、Gradleはこの情報を使用して、プロジェクトでの依存関係の解決を支援します。ターゲット環境は、「android」、「standard-jvm」、または「no-jvm」にすることができます。

この属性の公開を無効にするには、次のGradleプロパティを`gradle.properties`ファイルに追加します。

```none
kotlin.publishJvmEnvironmentAttribute=false
```

## ライブラリを宣伝する

あなたのライブラリは[JetBrainsの検索プラットフォーム](https://klibs.io/)で紹介できます。
ターゲットプラットフォームに基づいてKotlin Multiplatformライブラリを簡単に検索できるように設計されています。

基準を満たすライブラリは自動的に追加されます。ライブラリの追加方法の詳細については、[FAQ](https://klibs.io/faq)を参照してください。

## 次のステップ

* [Kotlin MultiplatformライブラリをMaven Centralリポジトリに公開する方法を学ぶ](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-libraries.html)
* [Kotlin Multiplatform用にライブラリを設計する際のベストプラクティスとヒントについては、ライブラリ作成者向けガイドラインを参照してください](api-guidelines-build-for-multiplatform)
  ```