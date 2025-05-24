---
title: "Kotlin Multiplatform の互換性ガイド"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<show-structure depth="1"/>

このガイドでは、Kotlin Multiplatformを使用してプロジェクトを開発する際に遭遇する可能性のある[互換性のない変更](kotlin-evolution-principles#incompatible-changes)についてまとめています。

現在のKotlinのStableバージョンは2.1.20です。プロジェクトで使用しているKotlinのバージョンに関連する特定の変更の非推奨サイクルに注意してください。例：

* Kotlin 1.7.0からKotlin 1.9.0にアップグレードする場合は、[Kotlin 1.9.0](#kotlin-1-9-0-1-9-25)と[Kotlin 1.7.0−1.8.22](#kotlin-1-7-0-1-8-22)の両方で有効になった互換性のない変更を確認してください。
* Kotlin 1.9.0からKotlin 2.0.0にアップグレードする場合は、[Kotlin 2.0.0](#kotlin-2-0-0-and-later)と[Kotlin 1.9.0−1.9.25](#kotlin-1-9-0-1-9-25)の両方で有効になった互換性のない変更を確認してください。

## バージョンの互換性

プロジェクトを構成する際は、Kotlin Multiplatform Gradle plugin（プロジェクト内のKotlinバージョンと同じ）の特定のバージョンと、Gradle、Xcode、Android Gradle pluginのバージョンとの互換性を確認してください。

| Kotlin Multiplatform plugin version | Gradle                                | Android Gradle plugin           | Xcode   |
|-------------------------------------|---------------------------------------|---------------------------------|---------|
| 2.1.20                              | 7.6.3–8.11 | 7.4.2–8.7.2 | 16.0 |
| 2.1.0–2.1.10                        | 7.6.3-8.10*                           | 7.4.2–8.7.2                     | 16.0    |
| 2.0.21                              | 7.5-8.8*                              | 7.4.2–8.5                       | 16.0    |
| 2.0.20                              | 7.5-8.8*                              | 7.4.2–8.5                       | 15.3    |
| 2.0.0                               | 7.5-8.5                               | 7.4.2–8.3                       | 15.3    |
| 1.9.20                              | 7.5-8.1.1                             | 7.4.2–8.2                       | 15.0    |
:::note
*Kotlin 2.0.20–2.0.21およびKotlin 2.1.0–2.1.10は、Gradle 8.6まで完全に互換性があります。
Gradleバージョン8.7–8.10もサポートされていますが、例外が1つあります。Kotlin Multiplatform Gradle pluginを使用している場合、マルチプラットフォームプロジェクトでJVMターゲットの`withJava()`関数を呼び出すと、非推奨の警告が表示される場合があります。
詳細については、[デフォルトで作成されるJavaソースセット](#java-source-sets-created-by-default)を参照してください。

## Kotlin 2.0.0 以降

このセクションでは、非推奨サイクルが終了し、Kotlin 2.0.0−2.1.20で有効になる互換性のない変更について説明します。

<anchor name="java-source-set-created-by-default"/>
### デフォルトで作成されるJavaソースセット

**変更点:**

Kotlin MultiplatformをGradleの今後の変更に合わせるため、`withJava()`関数を段階的に廃止しています。`withJava()`関数は、必要なJavaソースセットを作成することにより、GradleのJava pluginとの統合を可能にしました。Kotlin 2.1.20以降、これらのJavaソースセットはデフォルトで作成されます。

**推奨される方法:**

以前は、`src/jvmMain/java`および`src/jvmTest/java`ソースセットを作成するために、`withJava()`関数を明示的に使用する必要がありました。

```kotlin
kotlin {
    jvm {
        withJava()
    }
}
``` 

Kotlin 2.1.20以降、ビルドスクリプトから`withJava()`関数を削除できます。

さらに、GradleはJavaソースが存在する場合にのみJavaコンパイルタスクを実行するようになり、以前は実行されなかったJVM検証診断がトリガーされます。`KotlinJvmCompile`タスクまたは`compilerOptions`内で互換性のないJVMターゲットを明示的に構成すると、この診断は失敗します。JVMターゲットの互換性を確保するためのガイダンスについては、[関連するコンパイルタスクのJVMターゲットの互換性を確認する](gradle-configure-project#check-for-jvm-target-compatibility-of-related-compile-tasks)を参照してください。

プロジェクトでGradleバージョン8.7より高く、[Java](https://docs.gradle.org/current/userguide/java_plugin.html)、[Java Library](https://docs.gradle.org/current/userguide/java_library_plugin.html)、または[Application](https://docs.gradle.org/current/userguide/application_plugin.html)などのGradle Java plugin、またはGradle Java pluginに依存するサードパーティのGradle pluginを使用していない場合は、`withJava()`関数を削除できます。

プロジェクトで[Application](https://docs.gradle.org/current/userguide/application_plugin.html) Gradle Java pluginを使用している場合は、[新しいExperimental DSL](whatsnew2120#kotlin-multiplatform-new-dsl-to-replace-gradle-s-application-plugin)に移行することをお勧めします。Gradle 8.7以降、Application pluginはKotlin Multiplatform Gradle pluginでは機能しなくなります。

Kotlin Multiplatform Gradle pluginとJava用の他のGradle pluginの両方をマルチプラットフォームプロジェクトで使用する場合は、[Kotlin Multiplatform Gradle pluginとGradle Java pluginの非推奨の互換性](multiplatform-compatibility-guide#deprecated-compatibility-with-kotlin-multiplatform-gradle-plugin-and-gradle-java-plugins)を参照してください。

問題が発生した場合は、[issue tracker](https://kotl.in/issue)で報告するか、[パブリックSlackチャンネル](https://kotlinlang.slack.com/archives/C19FD9681)でヘルプを求めてください。

**変更はいつ有効になりますか？**

計画されている非推奨サイクルは次のとおりです。

* Gradle >8.6：`withJava()`関数を使用するマルチプラットフォームプロジェクトの以前のバージョンのKotlinに対して非推奨の警告を表示します。
* Gradle 9.0：この警告をエラーに上げます。
* 2.1.20：Gradleのバージョンで`withJava()`関数を使用すると、非推奨の警告を表示します。

<anchor name="android-target-rename"/>
### `android`ターゲットから`androidTarget`への名前変更

**変更点:**

Kotlin Multiplatformをより安定させるための取り組みを続けています。この方向への重要なステップは、Androidターゲットに対するファーストクラスのサポートを提供することです。将来的には、このサポートはGoogleのAndroidチームが開発した個別のpluginを介して提供されます。

新しいソリューションへの道を開くために、現在のKotlin DSLで`android`ブロックを`androidTarget`に名前変更しています。これは一時的な変更であり、Googleからの今後のDSLのために短い`android`名を解放するために必要です。

**推奨される方法:**

`android`ブロックのすべての出現箇所を`androidTarget`に名前変更します。Androidターゲットサポート用の新しいpluginが利用可能になったら、GoogleからのDSLに移行します。これは、Kotlin MultiplatformプロジェクトでAndroidを操作するための推奨されるオプションになります。

**変更はいつ有効になりますか？**

計画されている非推奨サイクルは次のとおりです。

* 1.9.0：Kotlin Multiplatformプロジェクトで`android`名が使用されている場合に非推奨の警告を表示します
* 2.1.0：この警告をエラーに上げます
* 2.2.0：Kotlin Multiplatform Gradle pluginから`android`ターゲットDSLを削除します

<anchor name="declaring-multiple-targets"/>
### 複数の類似ターゲットの宣言

**変更点:**

単一のGradleプロジェクトで複数の類似ターゲットを宣言することは推奨されていません。例：

```kotlin
kotlin {
    jvm("jvmKtor")
    jvm("jvmOkHttp") // 推奨されず、非推奨の警告が表示されます
}
```

一般的なケースの1つは、2つの関連するコードを一緒にすることです。たとえば、KtorまたはOkHttpライブラリを使用してネットワーキングを実装するために、`:shared` Gradleプロジェクトで`jvm("jvmKtor")`と`jvm("jvmOkHttp")`を使用したい場合があります。

```kotlin
// shared/build.gradle.kts:
kotlin {
    jvm("jvmKtor") {
        attributes.attribute(/* ... */)
    }
    jvm("jvmOkHttp") {
        attributes.attribute(/* ... */)
    }

    sourceSets {
        val commonMain by getting
        val commonJvmMain by sourceSets.creating {
            dependsOn(commonMain)
            dependencies {
                // 共有依存関係
            }
        }
        val jvmKtorMain by getting {
            dependsOn(commonJvmMain)
            dependencies {
                // Ktorの依存関係
            }
        }
        val jvmOkHttpMain by getting {
            dependsOn(commonJvmMain)
            dependencies {
                // OkHttpの依存関係
            }
        }
    }
}
```

実装には、自明ではない構成の複雑さが伴います。

* `:shared`側と各コンシューマー側でGradle属性を設定する必要があります。そうしないと、追加情報がないと、コンシューマーがKtorベースの実装とOkHttpベースの実装のどちらを受け取るべきかが不明確なため、Gradleはそのようなプロジェクトで依存関係を解決できません。
* `commonJvmMain`ソースセットを手動で設定する必要があります。
* 構成には、いくつかの低レベルのGradleおよびKotlin Gradle pluginの抽象化とAPIが含まれます。

**推奨される方法:**

構成が複雑なのは、Ktorベースの実装とOkHttpベースの実装が_同じGradleプロジェクト内にある_ためです。多くの場合、これらの部分を個別のGradleプロジェクトに抽出することができます。そのようなリファクタリングの一般的な概要を次に示します。

1. 元のプロジェクトから複製された2つのターゲットを単一のターゲットに置き換えます。これらのターゲット間で共有ソースセットがある場合は、そのソースと構成を新しく作成されたターゲットのデフォルトソースセットに移動します。

    ```kotlin
    // shared/build.gradle.kts:
    kotlin {
        jvm()
        
        sourceSets {
            jvmMain {
                // jvmCommonMainの構成をここにコピーします
            }
        }
    }
    ```

2. `settings.gradle.kts`ファイルで`include`を呼び出して、2つの新しいGradleプロジェクトを追加します。例：

    ```kotlin
    include(":okhttp-impl")
    include(":ktor-impl")
    ```

3. 各新しいGradleプロジェクトを構成します。

    * ほとんどの場合、これらのプロジェクトは1つのターゲットにのみコンパイルされるため、`kotlin("multiplatform")` pluginを適用する必要はありません。この例では、`kotlin("jvm")`を適用できます。
    * 元のターゲット固有のソースセットのコンテンツをそれぞれのプロジェクトに移動します。たとえば、`jvmKtorMain`から`ktor-impl/src`へ。
    * ソースセットの構成（依存関係、コンパイラオプションなど）をコピーします。
    * 新しいGradleプロジェクトから元のプロジェクトへの依存関係を追加します。

    ```kotlin
    // ktor-impl/build.gradle.kts:
    plugins {
        kotlin("jvm")
    }
    
    dependencies {
        project(":shared") // 元のプロジェクトへの依存関係を追加します
        // jvmKtorMainの依存関係をここにコピーします
    }
    
    kotlin {
        compilerOptions {
            // jvmKtorMainのコンパイラオプションをここにコピーします
        }
    }
    ```

このアプローチでは、初期設定にもっと多くの作業が必要になりますが、GradleとKotlin Gradle pluginの低レベルエンティティを使用しないため、結果のビルドをより簡単に使用および保守できます。

残念ながら、各ケースの詳細な移行手順を提供することはできません。上記の手順がうまくいかない場合は、この[YouTrack issue](https://youtrack.jetbrains.com/issue/KT-59316)でユースケースを説明してください。

**変更はいつ有効になりますか？**

計画されている非推奨サイクルは次のとおりです。

* 1.9.20：Kotlin Multiplatformプロジェクトで複数の類似ターゲットが使用されている場合に非推奨の警告を表示します
* 2.1.0：Kotlin/JSターゲットを除く、そのような場合にエラーを報告します。この例外の詳細については、[YouTrack](https://youtrack.jetbrains.com/issue/KT-47038/KJS-MPP-Split-JS-target-into-JsBrowser-and-JsNode)のissueを参照してください

<anchor name="deprecate-pre-hmpp-dependencies"/>
### レガシーモードで公開されたマルチプラットフォームライブラリのサポートの非推奨

**変更点:**

以前に、Kotlin Multiplatformプロジェクトで[レガシーモードを非推奨にし](#deprecated-gradle-properties-for-hierarchical-structure-support)、"レガシー"バイナリの公開を防止し、プロジェクトを[階層構造](multiplatform-hierarchy)に移行するように推奨しました。

エコシステムから"レガシー"バイナリを段階的に廃止し続けるために、Kotlin 1.9.0以降、レガシーライブラリの使用も推奨されなくなりました。プロジェクトでレガシーライブラリへの依存関係を使用すると、次の警告が表示されます。

```none
The dependency group:artifact:1.0 was published in the legacy mode. Support for such dependencies will be removed in the future
```

**推奨される方法:**

_マルチプラットフォームライブラリを使用する場合_、それらのほとんどはすでに"階層構造"モードに移行しているため、ライブラリのバージョンを更新するだけで済みます。詳細については、それぞれのライブラリのドキュメントを参照してください。

ライブラリがまだ非レガシーバイナリをサポートしていない場合は、メンテナに連絡して、この互換性の問題について伝えてください。

_ライブラリの作成者の場合_、Kotlin Gradle pluginを最新バージョンに更新し、[非推奨のGradleプロパティ](#deprecated-gradle-properties-for-hierarchical-structure-support)を修正したことを確認してください。

Kotlinチームは、エコシステムの移行を支援することに熱心です。問題が発生した場合は、[YouTrackでissueを作成する](https://kotl.in/issue)ことを躊躇しないでください。

**変更はいつ有効になりますか？**

計画されている非推奨サイクルは次のとおりです。

* 1.9：レガシーライブラリへの依存関係に対して非推奨の警告を表示します
* 2.0：レガシーライブラリへの依存関係に対する警告をエラーに上げます
* &gt;2.0：レガシーライブラリへの依存関係のサポートを削除します。そのような依存関係を使用すると、ビルドが失敗する可能性があります

<anchor name="deprecate-hmpp-properties"/>
### 階層構造のサポートに対する非推奨のGradleプロパティ

**変更点:**

その進化を通じて、Kotlinは[階層構造](multiplatform-hierarchy)のサポートを徐々に導入していました。
マルチプラットフォームプロジェクトでは、共通ソースセット`commonMain`と
プラットフォーム固有のソースセット（例：`jvmMain`）の間に中間ソースセットを持つ機能です。

移行期間中は、ツールチェーンが十分に安定していなかったため、いくつかのGradleプロパティが導入されました。
これにより、きめ細かいオプトインとオプトアウトが可能になりました。

Kotlin 1.6.20以降、階層プロジェクト構造のサポートはデフォルトで有効になっています。ただし、これらのプロパティは
ブロッキングの問題が発生した場合にオプトアウトできるように保持されていました。すべてのフィードバックを処理した後、これらのプロパティを完全に段階的に廃止し始めています。

次のプロパティは現在非推奨です。

* `kotlin.internal.mpp.hierarchicalStructureByDefault`
* `kotlin.mpp.enableCompatibilityMetadataVariant`
* `kotlin.mpp.hierarchicalStructureSupport`
* `kotlin.mpp.enableGranularSourceSetsMetadata`
* `kotlin.native.enableDependencyPropagation`

**推奨される方法:**

* これらのプロパティを`gradle.properties`ファイルと`local.properties`ファイルから削除します。
* GradleビルドスクリプトまたはGradle pluginでプログラムで設定することは避けてください。
* 非推奨のプロパティがビルドで使用されているサードパーティのGradle pluginによって設定されている場合は、pluginのメンテナに
  これらのプロパティを設定しないように依頼してください。

Kotlinツールチェーンのデフォルトの動作には1.6.20以降このようなプロパティが含まれていないため、削除しても大きな影響はないと考えています。ほとんどの場合、プロジェクトの再構築直後に結果が表示されます。

ライブラリの作成者で、さらに安全にしたい場合は、コンシューマーがライブラリを操作できることを確認してください。

**変更はいつ有効になりますか？**

計画されている非推奨サイクルは次のとおりです。

* 1.8.20：これらのプロパティが使用されている場合に警告を報告します
* 1.9.20：この警告をエラーに上げます
* 2.0：これらのプロパティを削除します。Kotlin Gradle pluginはそれらの使用を無視します

万が一、これらのプロパティを削除した後に問題が発生した場合は、[YouTrackでissueを作成する](https://kotl.in/issue)してください。

<anchor name="target-presets-deprecation"/>
### 非推奨のターゲットプリセットAPI

**変更点:**

ごく初期の開発段階で、Kotlin Multiplatformは、いわゆる_ターゲットプリセット_を操作するためのAPIを導入しました。
各ターゲットプリセットは、本質的にKotlin Multiplatformターゲットのファクトリを表していました。このAPIは、`jvm()`や`iosSimulatorArm64()`などのDSL関数が、はるかに
簡単で簡潔でありながら、同じユースケースをカバーするため、ほとんど冗長であることがわかりました。

混乱を減らし、より明確なガイドラインを提供するために、プリセット関連のAPIはすべて非推奨になり、将来のリリースでKotlin Gradle pluginのパブリックAPIから削除されます。これには以下が含まれます。

* `org.jetbrains.kotlin.gradle.dsl.KotlinMultiplatformExtension`の`presets`プロパティ
* `org.jetbrains.kotlin.gradle.plugin.KotlinTargetPreset`インターフェースとそのすべての継承
* `fromPreset`オーバーロード

**推奨される方法:**

代わりに、それぞれの[Kotlinターゲット](multiplatform-dsl-reference#targets)を使用してください。例：
<table>
<tr>
<td>
Before
</td>
<td>
Now
</td>
</tr>
<tr>
<td>

```kotlin
kotlin {
    targets {
        fromPreset(presets.iosArm64, 'ios')
    }
}
```
</td>
<td>

```kotlin
kotlin {
    iosArm64()
}
```
</td>
</tr>
</table>

**変更はいつ有効になりますか？**

計画されている非推奨サイクルは次のとおりです。

* 1.9.20：プリセット関連APIの使用に対して警告を報告します
* 2.0：この警告をエラーに上げます
* &gt;2.0：プリセット関連APIをKotlin Gradle pluginのパブリックAPIから削除します。引き続き使用するソースは
  "未解決の参照"エラーで失敗し、バイナリ（たとえば、Gradle plugin）は、最新バージョンのKotlin Gradle pluginに対して再コンパイルされない限り、リンケージエラーで失敗する可能性があります

<anchor name="target-shortcuts-deprecation"/>
### 非推奨のAppleターゲットショートカット

**変更点:**

Kotlin Multiplatform DSLで`ios()`、`watchos()`、および`tvos()`ターゲットショートカットを非推奨にしています。これらは、Appleターゲットのソースセット階層を部分的に作成するように設計されました。ただし、拡張が難しいことが判明し、混乱を招くこともありました。

たとえば、`ios()`ショートカットは`iosArm64`ターゲットと`iosX64`ターゲットの両方を作成しましたが、Apple Mチップを搭載したホストで作業する際に必要な`iosSimulatorArm64`
ターゲットは含まれていませんでした。ただし、このショートカットを変更することは難しく、既存のユーザープロジェクトで問題が発生する可能性がありました。

**推奨される方法:**

Kotlin Gradle pluginは、組み込みの階層テンプレートを提供するようになりました。Kotlin 1.9.20以降、デフォルトで有効になっており、一般的なユースケースに対して事前定義された中間ソースセットが含まれています。

ショートカットの代わりに、ターゲットのリストを指定する必要があります。その後、pluginはこのリストに基づいて中間ソースセットを自動的に設定します。

たとえば、プロジェクトに`iosArm64`ターゲットと`iosSimulatorArm64`ターゲットがある場合、pluginは`iosMain`および`iosTest`中間ソースセットを自動的に作成します。`iosArm64`ターゲットと`macosArm64`ターゲットがある場合、`appleMain`および`appleTest`ソースセットが作成されます。

詳細については、[階層プロジェクト構造](multiplatform-hierarchy)を参照してください

**変更はいつ有効になりますか？**

計画されている非推奨サイクルは次のとおりです。

* 1.9.20：`ios()`、`watchos()`、および`tvos()`ターゲットショートカットが使用されている場合に警告を報告します。
  代わりに、デフォルトの階層テンプレートがデフォルトで有効になります
* 2.1.0：ターゲットショートカットが使用されている場合にエラーを報告します
* 2.2.0：Kotlin Multiplatform Gradle pluginからターゲットショートカットDSLを削除します

### Kotlinのアップグレード後のiOSフレームワークのバージョンが正しくない

**問題点:**

直接統合を使用している場合、Kotlinコードの変更がXcodeのiOSアプリに反映されない場合があります。直接統合は、マルチプラットフォームプロジェクトからXcodeのiOSアプリにiOSフレームワークを接続する`embedAndSignAppleFrameworkForXcode`タスクで設定されます。

これは、マルチプラットフォームプロジェクトでKotlinのバージョンを1.9.2xから2.0.0にアップグレード（または2.0.0から1.9.2xにダウングレード）し、Kotlinファイルで変更を加えてアプリをビルドしようとすると、XcodeがiOSフレームワークの以前のバージョンを誤って使用する可能性があります。したがって、変更はXcodeのiOSアプリに表示されません。

**回避策:**

1. Xcodeで、**Product** | **Clean Build Folder**を使用してビルドディレクトリをクリーンアップします。
2. ターミナルで、次のコマンドを実行します。

   ```none
   ./gradlew clean
   ```

3. 新しいバージョンのiOSフレームワークが使用されるように、アプリを再度ビルドします。

**問題はいつ修正されますか？**

Kotlin 2.0.10でこの問題を修正する予定です。[Kotlin Early Access Previewに参加する](eap)セクションで、Kotlin 2.0.10のプレビューバージョンがすでに利用可能かどうかを確認できます。

詳細については、[YouTrackの対応するissue](https://youtrack.jetbrains.com/issue/KT-68257)を参照してください。

## Kotlin 1.9.0−1.9.25

このセクションでは、非推奨サイクルが終了し、Kotlin 1.9.0−1.9.25で有効になる互換性のない変更について説明します。

<anchor name="compilation-source-deprecation"/>
### KotlinソースセットをKotlinコンパイルに直接追加するための非推奨のAPI

**変更点:**

`KotlinCompilation.source`へのアクセスは非推奨になりました。次のようなコードは非推奨の警告を生成します。

```kotlin
kotlin {
    jvm()
    js()
    iosArm64()
    iosSimulatorArm64()
    
    sourceSets {
        val commonMain by getting
        val myCustomIntermediateSourceSet by creating {
            dependsOn(commonMain)
        }
        
        targets["jvm"].compilations["main"].source(myCustomIntermediateSourceSet)
    }
}
```

**推奨される方法:**

`KotlinCompilation.source(someSourceSet)`を置き換えるには、`KotlinCompilation`のデフォルトソースセットから`someSourceSet`への`dependsOn`関係を追加します。`by getting`を使用してソースを直接参照することをお勧めします。これは、より短く、読みやすいためです。ただし、すべての場合に適用可能な`KotlinCompilation.defaultSourceSet.dependsOn(someSourceSet)`を使用することもできます。

上記のコードは、次のいずれかの方法で変更できます。

```kotlin
kotlin {
    jvm()
    js()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        val commonMain by getting
        val myCustomIntermediateSourceSet by creating {
            dependsOn(commonMain)
        }
        
        // オプション＃1。より短く、読みやすい。可能な限り使用してください。
        // 通常、デフォルトのソースセットの名前
        // は、ターゲット名とコンパイル名を単純に連結したものです。
        val jvmMain by getting {
            dependsOn(myCustomIntermediateSourceSet)
        }
        
        // オプション＃2。汎用的なソリューション。ビルドスクリプトでより高度なアプローチが必要な場合に使用します。
        targets["jvm"].compilations["main"].defaultSourceSet.dependsOn(myCustomIntermediateSourceSet)
    }
}
```

**変更はいつ有効になりますか？**

計画されている非推奨サイクルは次のとおりです。

* 1.9.0：`KotlinComplation.source`が使用されている場合に非推奨の警告を表示します
* 1.9.20：この警告をエラーに上げます
* &gt;1.9.20：Kotlin Gradle pluginから`KotlinComplation.source`を削除します。使用しようとすると、ビルドスクリプトのコンパイル中に"未解決の
  参照"エラーが発生します

<anchor name="kotlin-js-plugin-deprecation"/>
### `kotlin-js` Gradle pluginから`kotlin-multiplatform` Gradle pluginへの移行

**変更点:**

Kotlin 1.9.0以降、`kotlin-js` Gradle pluginは非推奨になりました。基本的に、`js()`ターゲットを備えた`kotlin-multiplatform` pluginの機能を複製し、内部で同じ実装を共有していました。このような重複は混乱を引き起こし、Kotlinチームのメンテナンス負荷を増やしました。代わりに、`js()`ターゲットを備えた`kotlin-multiplatform` Gradle pluginに移行することをお勧めします。

**推奨される方法:**

1. プロジェクトから`kotlin-js` Gradle pluginを削除し、`pluginManagement {}`ブロックを使用している場合は、`settings.gradle.kts`ファイルで`kotlin-multiplatform`を適用します。

   <Tabs>
   <TabItem value="kotlin-js" label="kotlin-js">

   ```kotlin
   // settings.gradle.kts:
   pluginManagement {
       plugins {
           // 次の行を削除します：
           kotlin("js") version "1.9.0"
       }
       
       repositories {
           // ...
       }
   }
   ```

   </TabItem>
   <TabItem value="kotlin-multiplatform" label="kotlin-multiplatform">

   ```kotlin
   // settings.gradle.kts:
   pluginManagement {
       plugins {
           // 代わりに次の行を追加します：
           kotlin("multiplatform") version "1.9.0"
       }
       
       repositories {
           // ...
       }
   }
   ```

   </TabItem>
   </Tabs>

   pluginを適用する別の方法を使用している場合は、[Gradleドキュメント](https://docs.gradle.org/current/userguide/plugins.html)で移行手順を参照してください。

2. ソースファイルを`main`フォルダーと`test`フォルダーから、同じディレクトリ内の`jsMain`フォルダーと`jsTest`フォルダーに移動します。
3. 依存関係の宣言を調整します。

   * `sourceSets {}`ブロックを使用し、それぞれのソースセット（本番環境の依存関係の場合は`jsMain {}`、テストの依存関係の場合は`jsTest {}`）の依存関係を構成することをお勧めします。
     詳細については、[依存関係の追加](multiplatform-add-dependencies)を参照してください。
   * ただし、最上位のブロックで依存関係を宣言する場合は、
     宣言を`api("group:artifact:1.0")`から`add("jsMainApi", "group:artifact:1.0")`などに変更します。

      この場合、最上位の`dependencies {}`ブロックが`kotlin {}`ブロックの**後**に来るようにしてください。そうしないと、「構成が見つかりません」というエラーが表示されます。
     
     

   `build.gradle.kts`ファイルのコードは、次のいずれかの方法で変更できます。

   <Tabs>
   <TabItem value="kotlin-js" label="kotlin-js">

   ```kotlin
   // build.gradle.kts:
   plugins {
       kotlin("js") version "1.9.0"
   }
   
   dependencies {
       testImplementation(kotlin("test"))
       implementation("org.jetbrains.kotlinx:kotlinx-html:0.8.0")
   }
   
   kotlin {
       js {
           // ...
       }
   }
   ```

   </TabItem>
   <TabItem value="kotlin-multiplatform" label="kotlin-multiplatform">

   ```kotlin
   // build.gradle.kts:
   plugins {
       kotlin("multiplatform") version "1.9.0"
   }
   
   kotlin {
       js {
           // ...
       }
       
       // オプション＃1。sourceSets {}ブロックで依存関係を宣言します。
       sourceSets {
           val jsMain by getting {
               dependencies {
                   // ここにjsプレフィックスは必要ありません。最上位のブロックからコピーして貼り付けるだけです
                   implementation("org.jetbrains.kotlinx:kotlinx-html:0.8.0")
               }
          }
       }
   }
   
   dependencies {
       // オプション＃2。依存関係の宣言にjsプレフィックスを追加します。
       add("jsTestImplementation", kotlin("test"))
   }
   ```

   </TabItem>
   </Tabs>

4. `kotlin {}`ブロック内でKotlin Gradle pluginによって提供されるDSLは、ほとんどの場合変更されていません。ただし、
   タスクや構成などの低レベルのGradleエンティティを名前で参照していた場合は、通常、`js`プレフィックスを追加して調整する必要があります。たとえば、`browserTest`タスクは`jsBrowserTest`という名前で見つけることができます。

**変更はいつ有効になりますか？**

1.9.0では、`kotlin-js` Gradle pluginを使用すると、非推奨の警告が生成されます。

<anchor name="jvmWithJava-preset-deprecation"/>
### 非推奨の`jvmWithJava`プリセット

**変更点:**

`targetPresets.jvmWithJava`は非推奨であり、その使用は推奨されていません。

**推奨される方法:**

代わりに`jvm { withJava() }`ターゲットを使用してください。`jvm { withJava() }`に切り替えた後、`.java`ソースを含むソースディレクトリへのパスを調整する必要があることに注意してください。

たとえば、デフォルト名「jvm」で`jvm`ターゲットを使用する場合：

| Before          | Now                |
|-----------------|--------------------|
| `src/main/java` | `src/jvmMain/java` |
| `src/test/java` | `src/jvmTest/java` |

**変更はいつ有効になりますか？**

計画されている非推奨サイクルは次のとおりです。

* 1.3.40：`targetPresets.jvmWithJava`が使用されている場合に警告を表示します
* 1.9.20：この警告をエラーに上げます
* >1.9.20：`targetPresets.jvmWithJava` APIを削除します。使用しようとすると、ビルドスクリプトのコンパイルが失敗します

`targetPresets` API全体が非推奨であっても、`jvmWithJava`プリセットには異なる非推奨タイムラインがあります。

:::

<anchor name="android-sourceset-layout-v1-deprecation"/>
### 非推奨のレガシーAndroidソースセットレイアウト

**変更点:**

[新しいAndroidソースセットレイアウト](multiplatform-android-layout)は、Kotlin 1.9.0以降、デフォルトで使用されます。
レガシーレイアウトのサポートは非推奨であり、`kotlin.mpp.androidSourceSetLayoutVersion` Gradleプロパティを使用すると、非推奨の診断がトリガーされるようになりました。

**変更はいつ有効になりますか？**

計画されている非推奨サイクルは次のとおりです。

* &lt;=1.9.0：`kotlin.mpp.androidSourceSetLayoutVersion=1`が使用されている場合に警告を報告します。警告は、
  `kotlin.mpp.androidSourceSetLayoutVersion1.nowarn=true` Gradleプロパティで抑制できます
* 1.9.20：この警告をエラーに上げます。エラーは**抑制できません**
* &gt;1.9.20：`kotlin.mpp.androidSourceSetLayoutVersion=1`のサポートを削除します。Kotlin Gradle pluginはこのプロパティを無視します

<anchor name="common-sourceset-with-dependson-deprecation"/>
### カスタム`dependsOn`を使用した非推奨の`commonMain`と`commonTest`

**変更点:**

`commonMain`ソースセットと`commonTest`ソースセットは、通常、`main`ソースセット階層と`test`ソースセット階層のルートを表します。
それぞれ。ただし、これらのソースセットの`dependsOn`関係を手動で構成することにより、それをオーバーライドすることができました。

このような構成を維持するには、マルチプラットフォームビルドの内部構造に関する特別な労力と知識が必要です。さらに、
`commonMain`が`main`ソースセット階層のルートであるかどうかを確認するために、特定のビルドスクリプトを読む必要があるため、コードの可読性と再利用性が低下します。

したがって、`commonMain`と`commonTest`での`dependsOn`へのアクセスは非推奨になりました。

**推奨される方法:**

`commonMain.dependsOn(customCommonMain)`を使用する`customCommonMain`ソースセットを1.9.20に移行する必要があると仮定します。
ほとんどの場合、`customCommonMain`は`commonMain`と同じコンパイルに参加するため、`customCommonMain`を`commonMain`にマージできます。

1. `customCommonMain`のソースを`commonMain`にコピーします。
2. `customCommonMain`のすべての依存関係を`commonMain`に追加します。
3. `customCommonMain`のすべてのコンパイラオプション設定を`commonMain`に追加します。

まれに、`customCommonMain`が`commonMain`よりも多くのコンパイルに参加している場合があります。
このような構成では、ビルドスクリプトの追加の低レベル構成が必要です。それがあなたの
ユースケースでない場合は、ほとんどの場合そうではありません。

ユースケースの場合は、`customCommonMain`のソースと設定を`commonMain`に移動し、その逆も同様に、これら2つのソースセットを「スワップ」します。

**変更はいつ有効になりますか？**

計画されている非推奨サイクルは次のとおりです。

* 1.9.0：`dependsOn`が`commonMain`で使用されている場合に警告を報告します
* &gt;=1.9.20：`dependsOn`が`commonMain`または`commonTest`で使用されている場合にエラーを報告します

### Forward declarationに対する新しいアプローチ

**変更点:**

JetBrainsチームは、Kotlinのforward declarationに対するアプローチを刷新し、その動作をより