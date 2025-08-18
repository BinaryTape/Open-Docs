[//]: # (title: Kotlin Multiplatform 互換性ガイド)

<show-structure depth="1"/>

このガイドでは、Kotlin Multiplatform を使用してプロジェクトを開発する際に発生する可能性のある[非互換の変更点](https://kotlinlang.org/docs/kotlin-evolution-principles.html#incompatible-changes)をまとめています。

現在のKotlinの安定バージョンは %kotlinVersion% です。プロジェクトで使用しているKotlinのバージョンとの関連で、特定の変更の非推奨サイクルに留意してください。例：

*   Kotlin 1.7.0 から Kotlin 1.9.0 にアップグレードする場合、[Kotlin 1.9.0](#kotlin-1-9-0-1-9-25) と [Kotlin 1.7.0−1.8.22](#kotlin-1-7-0-1-8-22) の両方で有効になった非互換の変更点を確認してください。
*   Kotlin 1.9.0 から Kotlin 2.0.0 にアップグレードする場合、[Kotlin 2.0.0](#kotlin-2-0-0-and-later) と [Kotlin 1.9.0−1.9.25](#kotlin-1-9-0-1-9-25) の両方で有効になった非互換の変更点を確認してください。

## バージョンの互換性

プロジェクトを設定する際には、使用しているKotlin Multiplatform Gradleプラグイン（プロジェクトのKotlinバージョンと同じ）のバージョンが、Gradle、Xcode、およびAndroid Gradleプラグインの各バージョンと互換性があることを確認してください。

| Kotlin Multiplatform プラグインバージョン | Gradle                                | Android Gradle プラグイン                               | Xcode   |
|-------------------------------------|---------------------------------------|-----------------------------------------------------|---------|
| 2.2.0-2.2.10                        | %minGradleVersion%–%maxGradleVersion% | %minAndroidGradleVersion%–%maxAndroidGradleVersion% | %xcode% |
| 2.1.21                              | 7.6.3–8.12.1                          | 7.3.1–8.7.2                                         | 16.3    |
| 2.1.20                              | 7.6.3–8.11                            | 7.4.2–8.7.2                                         | 16.0    |
| 2.1.0–2.1.10                        | 7.6.3-8.10*                           | 7.4.2–8.7.2                                         | 16.0    |
| 2.0.21                              | 7.5-8.8*                              | 7.4.2–8.5                                           | 16.0    |
| 2.0.20                              | 7.5-8.8*                              | 7.4.2–8.5                                           | 15.3    |
| 2.0.0                               | 7.5-8.5                               | 7.4.2–8.3                                           | 15.3    |
| 1.9.20                              | 7.5-8.1.1                             | 7.4.2–8.2                                           | 15.0    |

> *Kotlin 2.0.20–2.0.21 および Kotlin 2.1.0–2.1.10 は、Gradle 8.6まで完全に互換性があります。
> Gradle バージョン 8.7–8.10 もサポートされていますが、1つだけ例外があります。Kotlin Multiplatform Gradleプラグインを使用している場合、JVMターゲットで `withJava()` 関数を呼び出す際に、マルチプラットフォームプロジェクトで非推奨の警告が表示されることがあります。
> 詳細については、[デフォルトで作成されるJavaソースセット](#java-source-sets-created-by-default)を参照してください。
>
{style="warning"}

## Kotlin 2.0.0 以降

このセクションでは、Kotlin 2.0.0−%kotlinVersion% で非推奨サイクルを終了し、有効になる非互換の変更点について説明します。

### ビットコード埋め込みの非推奨化

**変更点**

ビットコードの埋め込みは Xcode 14 で非推奨となり、Xcode 15 でAppleターゲットすべてから削除されました。これに伴い、フレームワーク設定の `embedBitcode` パラメーター、および `-Xembed-bitcode` と `-Xembed-bitcode-marker` コマンドライン引数は Kotlin で非推奨になりました。

**現在の推奨プラクティス**

以前のバージョンの Xcode を使用しているが、Kotlin 2.0.20 以降にアップグレードしたい場合は、Xcode プロジェクトでビットコードの埋め込みを無効にしてください。

**変更の適用時期**

計画されている非推奨サイクルは以下の通りです。

*   2.0.20: Kotlin/Native コンパイラはビットコードの埋め込みをサポートしなくなります。
*   2.1.0: Kotlin Multiplatform Gradleプラグインで `embedBitcode` DSL が警告付きで非推奨になります。
*   2.2.0: 警告がエラーに格上げされます。
*   2.3.0: `embedBitcode` DSL が削除されます。

### デフォルトで作成されるJavaソースセット

**変更点**

Kotlin Multiplatform を Gradle の今後の変更に合わせるため、`withJava()` 関数の段階的な廃止を進めています。`withJava()` 関数は、必要なJavaソースセットを作成することで、GradleのJavaプラグインとの統合を可能にしました。Kotlin 2.1.20 以降、これらのJavaソースセットはデフォルトで作成されます。

**現在の推奨プラクティス**

以前は、`src/jvmMain/java` および `src/jvmTest/java` ソースセットを作成するために、明示的に `withJava()` 関数を使用する必要がありました。

```kotlin
kotlin {
    jvm {
        withJava()
    }
}
```

Kotlin 2.1.20 以降、ビルドスクリプトから `withJava()` 関数を削除できます。

さらに、Gradle はJavaソースが存在する場合にのみJavaコンパイルタスクを実行するようになり、以前は実行されなかったJVM検証診断がトリガーされます。この診断は、`KotlinJvmCompile` タスクまたは `compilerOptions` 内で互換性のないJVMターゲットを明示的に設定した場合に失敗します。JVMターゲットの互換性を確保するためのガイダンスについては、[関連するコンパイルタスクのJVMターゲット互換性を確認する](https://kotlinlang.org/docs/gradle-configure-project.html#check-for-jvm-target-compatibility-of-related-compile-tasks)を参照してください。

プロジェクトが Gradle バージョン 8.7 より高く、[Java](https://docs.gradle.org/current/userguide/java_plugin.html)、[Java Library](https://docs.gradle.org/current/userguide/java_library_plugin.html)、[Application](https://docs.gradle.org/current/userguide/application_plugin.html) のようなGradle Javaプラグイン、またはGradle Javaプラグインに依存関係を持つサードパーティのGradleプラグインに依存していない場合、`withJava()` 関数を削除できます。

プロジェクトが[Application](https://docs.gradle.org/current/userguide/application_plugin.html) Gradle Javaプラグインを使用している場合、[新しい実験的なDSL](https://kotlinlang.org/docs/whatsnew2120.html#kotlin-multiplatform-new-dsl-to-replace-gradle-s-application-plugin)への移行をお勧めします。Gradle 8.7 以降、Applicationプラグインは Kotlin Multiplatform Gradleプラグインでは動作しなくなります。

マルチプラットフォームプロジェクトで Kotlin Multiplatform Gradleプラグインと他のGradle Javaプラグインの両方を使用したい場合は、[Kotlin Multiplatform GradleプラグインとGradle Javaプラグインの非推奨の互換性](multiplatform-compatibility-guide.md#deprecated-compatibility-with-kotlin-multiplatform-gradle-plugin-and-gradle-java-plugins)を参照してください。

Kotlin 2.1.20 と Gradle バージョン 8.7 より高いバージョンで [Java test fixtures](https://docs.gradle.org/current/userguide/java_testing.html#sec:java_test_fixtures) Gradleプラグインを使用すると、このプラグインは動作しません。代わりに、この問題が解決されている[Kotlin 2.1.21](https://kotlinlang.org/docs/releases.html#release-details)にアップグレードしてください。

問題が発生した場合は、[課題トラッカー](https://kotl.in/issue)に報告するか、[公開Slackチャンネル](https://kotlinlang.slack.com/archives/C19FD9681)でサポートを求めてください。

**変更の適用時期**

計画されている非推奨サイクルは以下の通りです。

*   Gradle >8.6: `withJava()` 関数を使用するマルチプラットフォームプロジェクトで、以前のKotlinバージョンに対する非推奨警告を導入します。
*   Gradle 9.0: この警告をエラーに格上げします。
*   2.1.20: どのGradleバージョンでも `withJava()` 関数を使用すると、非推奨警告を導入します。

### `android` ターゲットから `androidTarget` への名称変更

**変更点**

Kotlin Multiplatform をより安定させるための取り組みを続けています。この方向性における重要なステップは、Android ターゲットに対するファーストクラスのサポートを提供することです。将来的には、このサポートはGoogleのAndroidチームによって開発される別のプラグインを通じて提供される予定です。

新しいソリューションへの道を開くため、現在のKotlin DSL で `android` ブロックを `androidTarget` に変更します。これは、Google から提供される今後のDSLのために短い `android` 名を空けるために必要な一時的な変更です。

**現在の推奨プラクティス**

`android` ブロックのすべての出現箇所を `androidTarget` に変更してください。Android ターゲットサポートの新しいプラグインが利用可能になったら、Google のDSLに移行してください。これは、Kotlin Multiplatform プロジェクトで Android を操作するための推奨オプションとなります。

**変更の適用時期**

計画されている非推奨サイクルは以下の通りです。

*   1.9.0: Kotlin Multiplatform プロジェクトで `android` 名が使用された場合に非推奨警告を導入します。
*   2.1.0: この警告をエラーに格上げします。
*   2.2.0: Kotlin Multiplatform Gradleプラグインから `android` ターゲットDSLを削除します。

### 類似する複数のターゲットの宣言

**変更点**

単一のGradleプロジェクトで複数の類似するターゲットを宣言することは推奨されません。例えば：

```kotlin
kotlin {
    jvm("jvmKtor")
    jvm("jvmOkHttp") // Not recommended and produces a deprecation warning
}
```

一般的なケースとして、2つの関連するコードを一緒に持つことがあります。例えば、`:shared` Gradle プロジェクトで `jvm("jvmKtor")` と `jvm("jvmOkHttp")` を使用して、Ktor または OkHttp ライブラリを用いたネットワーキングを実装したい場合があります。

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
                // Shared dependencies
            }
        }
        val jvmKtorMain by getting {
            dependsOn(commonJvmMain)
            dependencies {
                // Ktor dependencies
            }
        }
        val jvmOkHttpMain by getting {
            dependsOn(commonJvmMain)
            dependencies {
                // OkHttp dependencies
            }
        }
    }
}
```

この実装には、自明ではない設定の複雑さが伴います。

*   `:shared` 側と各コンシューマー側でGradle属性を設定する必要があります。そうしないと、追加情報がない場合、コンシューマーがKtorベースの実装を受け取るべきか、OkHttpベースの実装を受け取るべきかが不明確になるため、Gradleはそのようなプロジェクトの依存関係を解決できません。
*   `commonJvmMain` ソースセットを手動で設定する必要があります。
*   この設定には、低レベルのGradleおよびKotlin Gradleプラグインの抽象化とAPIが多数含まれます。

**現在の推奨プラクティス**

設定が複雑なのは、KtorベースとOkHttpベースの実装が_同じGradleプロジェクト内にある_ためです。多くの場合、これらの部分を別々のGradleプロジェクトに抽出することが可能です。そのようなリファクタリングの一般的な概要を以下に示します。

1.  元のプロジェクトから重複する2つのターゲットを単一のターゲットに置き換えます。これらのターゲット間で共有ソースセットがあった場合、そのソースと設定を新しく作成されたターゲットのデフォルトソースセットに移動します。

    ```kotlin
    // shared/build.gradle.kts:
    kotlin {
        jvm()
        
        sourceSets {
            jvmMain {
                // Copy the configuration of jvmCommonMain here
            }
        }
    }
    ```

2.  通常、`settings.gradle.kts` ファイルで `include` を呼び出して、2つの新しいGradleプロジェクトを追加します。例えば：

    ```kotlin
    include(":okhttp-impl")
    include(":ktor-impl")
    ```

3.  各新しいGradleプロジェクトを設定します。

    *   これらのプロジェクトは1つのターゲットのみにコンパイルされるため、`kotlin("multiplatform")` プラグインを適用する必要はないでしょう。この例では、`kotlin("jvm")` を適用できます。
    *   元のターゲット固有のソースセットの内容をそれぞれのプロジェクトに移動します。例えば、`jvmKtorMain` から `ktor-impl/src` へ。
    *   ソースセットの設定（依存関係、コンパイラオプションなど）をコピーします。
    *   新しいGradleプロジェクトから元のプロジェクトへの依存関係を追加します。

    ```kotlin
    // ktor-impl/build.gradle.kts:
    plugins {
        kotlin("jvm")
    }
    
    dependencies {
        project(":shared") // Add dependency on the original project
        // Copy dependencies of jvmKtorMain here
    }
    
    kotlin {
        compilerOptions {
            // Copy compiler options of jvmKtorMain here
        }
    }
    ```

このアプローチは初期設定に多くの作業を必要としますが、GradleおよびKotlin Gradleプラグインの低レベルのエンティティを使用しないため、結果として得られるビルドの利用と保守が容易になります。

> 残念ながら、各ケースの詳細な移行手順を提供することはできません。上記の手順がうまくいかない場合は、この[YouTrack課題](https://youtrack.jetbrains.com/issue/KT-59316)でユースケースを説明してください。
>
{style="tip"}

**変更の適用時期**

計画されている非推奨サイクルは以下の通りです。

*   1.9.20: Kotlin Multiplatform プロジェクトで複数の類似するターゲットが使用された場合に非推奨警告を導入します。
*   2.1.0: そのようなケースではエラーを報告します（Kotlin/JSターゲットを除く）。この例外の詳細については、[YouTrack](https://youtrack.jetbrains.com/issue/KT-47038/KJS-MPP-Split-JS-target-into-JsBrowser-and-JsNode)の課題を参照してください。

### レガシーモードで公開されたマルチプラットフォームライブラリのサポート非推奨化

**変更点**

以前、Kotlin Multiplatform プロジェクトでは「レガシー」バイナリの公開を停止する[レガシーモードを非推奨化し](#deprecated-gradle-properties-for-hierarchical-structure-support)、プロジェクトを[階層構造](multiplatform-hierarchy.md)に移行することを推奨していました。

エコシステムから「レガシー」バイナリを段階的に廃止し続けるため、Kotlin 1.9.0以降、レガシーライブラリの使用も推奨されません。プロジェクトがレガシーライブラリに依存している場合、以下の警告が表示されます。

```none
The dependency group:artifact:1.0 was published in the legacy mode. Support for such dependencies will be removed in the future
```

**現在の推奨プラクティス**

_マルチプラットフォームライブラリを使用している場合_、そのほとんどはすでに「階層構造」モードに移行しているため、ライブラリのバージョンを更新するだけで済みます。詳細については、各ライブラリのドキュメントを参照してください。

ライブラリがまだ非レガシーバイナリをサポートしていない場合、メンテナーに連絡し、この互換性問題について伝えることができます。

_ライブラリの作成者である場合_、Kotlin Gradleプラグインを最新バージョンに更新し、[非推奨のGradleプロパティ](#deprecated-gradle-properties-for-hierarchical-structure-support)を修正したことを確認してください。

Kotlinチームはエコシステムの移行を支援することに熱心ですので、何か問題に直面した場合は、遠慮なく[YouTrackで課題](https://kotl.in/issue)を作成してください。

**変更の適用時期**

計画されている非推奨サイクルは以下の通りです。

*   1.9.0: レガシーライブラリへの依存関係に対する非推奨警告を導入します。
*   2.0.0: レガシーライブラリへの依存関係に対する警告をエラーに格上げします。
*   >2.0.0: レガシーライブラリへの依存関係のサポートを削除します。そのような依存関係を使用すると、ビルドが失敗する可能性があります。

### 階層構造サポートのための非推奨Gradleプロパティ

**変更点**

Kotlinは進化の過程で、マルチプラットフォームプロジェクトにおける[階層構造](multiplatform-hierarchy.md)のサポートを徐々に導入してきました。これは、共通ソースセットの `commonMain` と任意のプラットフォーム固有のソースセット（例: `jvmMain`）の間に中間ソースセットを持つことができる機能です。

ツールチェーンが十分に安定していない移行期間中、きめ細かいオプトインとオプトアウトを可能にするいくつかのGradleプロパティが導入されました。

Kotlin 1.6.20以降、階層型プロジェクト構造のサポートはデフォルトで有効になっています。しかし、これらのプロパティは、ブロッキング問題が発生した場合のオプトアウトのために残されていました。すべてのフィードバックを処理した後、これらのプロパティの完全な段階的廃止を開始します。

以下のプロパティは非推奨になりました。

*   `kotlin.internal.mpp.hierarchicalStructureByDefault`
*   `kotlin.mpp.enableCompatibilityMetadataVariant`
*   `kotlin.mpp.hierarchicalStructureSupport`
*   `kotlin.mpp.enableGranularSourceSetsMetadata`
*   `kotlin.native.enableDependencyPropagation`

**現在の推奨プラクティス**

*   これらのプロパティを `gradle.properties` および `local.properties` ファイルから削除します。
*   GradleビルドスクリプトやGradleプラグインで、これらをプログラムで設定することは避けてください。
*   ビルドで使用されているサードパーティのGradleプラグインによって非推奨プロパティが設定されている場合、プラグインのメンテナーにこれらのプロパティを設定しないように依頼してください。

Kotlin 1.6.20以降、Kotlinツールチェーンのデフォルト動作にはそのようなプロパティが含まれていないため、重大な影響はないと予想されます。ほとんどの変更は、プロジェクトが再構築された直後に確認できます。

ライブラリの作者で、特に安全を期したい場合は、コンシューマーがあなたのライブラリを問題なく使用できるか確認してください。

**変更の適用時期**

計画されている非推奨サイクルは以下の通りです。

*   1.8.20: 非推奨のGradleプロパティが使用された場合に警告を報告します。
*   1.9.20: この警告をエラーに格上げします。
*   2.0.0: 非推奨のプロパティを削除します。Kotlin Gradleプラグインはそれらの使用を無視します。

これらのプロパティを削除した後に問題が発生する可能性は低いですが、万一問題が発生した場合は、[YouTrackで課題](https://kotl.in/issue)を作成してください。

### ターゲットプリセットAPIの非推奨化

**変更点**

非常に初期の開発段階で、Kotlin Multiplatform は、いわゆる_ターゲットプリセット_を扱うためのAPIを導入しました。各ターゲットプリセットは、本質的にKotlin Multiplatformターゲットのファクトリとして機能していました。このAPIは、`jvm()` や `iosSimulatorArm64()` のようなDSL関数が同じユースケースをより直接的かつ簡潔にカバーできるため、ほとんど冗長であることが判明しました。

混乱を減らし、より明確なガイドラインを提供するため、Kotlin Gradleプラグインの公開APIにおいて、プリセット関連のすべてのAPIが非推奨になりました。これには以下が含まれます。

*   `org.jetbrains.kotlin.gradle.dsl.KotlinMultiplatformExtension` の `presets` プロパティ
*   `org.jetbrains.kotlin.gradle.plugin.KotlinTargetPreset` インターフェースとそのすべての継承クラス
*   `fromPreset` のオーバーロード

**現在の推奨プラクティス**

代わりに、それぞれの[Kotlinターゲット](multiplatform-dsl-reference.md#targets)を使用してください。例：

<table>
    
<tr>
<td>変更前</td>
        <td>変更後</td>
</tr>

    
<tr>
<td>
<code-block lang="kotlin" code="kotlin {&#10;    targets {&#10;        fromPreset(presets.iosArm64, 'ios')&#10;    }&#10;}"/>
</td>
<td>
<code-block lang="kotlin" code="kotlin {&#10;    iosArm64()&#10;}"/>
</td>
</tr>

</table>

**変更の適用時期**

計画されている非推奨サイクルは以下の通りです。

*   1.9.20: プリセット関連APIのすべての使用に対して警告を報告します。
*   2.0.0: この警告をエラーに格上げします。
*   2.2.0: Kotlin Gradleプラグインの公開APIからプリセット関連APIを削除します。まだそれを使用しているソースは「未解決の参照」エラーで失敗し、バイナリ（例：Gradleプラグイン）は、最新バージョンのKotlin Gradleプラグインに対して再コンパイルしない限り、リンケージエラーで失敗する可能性があります。

### Appleターゲットショートカットの非推奨化

**変更点**

Kotlin Multiplatform DSL における `ios()`、`watchos()`、`tvos()` ターゲットショートカットを非推奨にします。これらはAppleターゲットのソースセット階層を部分的に作成するために設計されていました。しかし、これらは拡張が難しく、時には混乱を招くことが判明しました。

例えば、`ios()` ショートカットは `iosArm64` と `iosX64` の両方のターゲットを作成しましたが、Apple Mチップを搭載したホストで作業する際に必要な `iosSimulatorArm64` ターゲットは含まれていませんでした。しかし、このショートカットを変更することは実装が難しく、既存のユーザープロジェクトで問題を引き起こす可能性がありました。

**現在の推奨プラクティス**

Kotlin Gradleプラグインは現在、組み込みの階層テンプレートを提供しています。Kotlin 1.9.20以降、これはデフォルトで有効になっており、一般的なユースケース向けに事前定義された中間ソースセットが含まれています。

ショートカットの代わりに、ターゲットのリストを指定すると、プラグインがそのリストに基づいて自動的に中間ソースセットを設定します。

例えば、プロジェクトに `iosArm64` と `iosSimulatorArm64` ターゲットがある場合、プラグインは自動的に `iosMain` と `iosTest` の中間ソースセットを作成します。`iosArm64` と `macosArm64` ターゲットがある場合、`appleMain` と `appleTest` ソースセットが作成されます。

詳細については、[階層型プロジェクト構造](multiplatform-hierarchy.md)を参照してください。

**変更の適用時期**

計画されている非推奨サイクルは以下の通りです。

*   1.9.20: `ios()`、`watchos()`、および `tvos()` ターゲットショートカットが使用された場合に警告を報告します。代わりに、デフォルトの階層テンプレートがデフォルトで有効になります。
*   2.1.0: ターゲットショートカットが使用された場合にエラーを報告します。
*   2.2.0: Kotlin Multiplatform GradleプラグインからターゲットショートカットDSLを削除します。

### Kotlin アップグレード後のiOSフレームワークのバージョン不正

**問題点**

直接統合を使用している場合、Kotlin コードの変更が Xcode の iOS アプリに反映されないことがあります。直接統合は `embedAndSignAppleFrameworkForXcode` タスクで設定され、これによりマルチプラットフォームプロジェクトのiOSフレームワークがXcodeのiOSアプリに接続されます。

これは、マルチプラットフォームプロジェクトでKotlinのバージョンを1.9.2xから2.0.0にアップグレード（または2.0.0から1.9.2xにダウングレード）し、Kotlinファイルに変更を加えてアプリをビルドしようとすると発生する可能性があり、Xcodeが誤って以前のバージョンのiOSフレームワークを使用する場合があります。そのため、変更がXcodeのiOSアプリに表示されません。

**回避策**

1.  Xcodeで、**Product** | **Clean Build Folder** を使用してビルドディレクトリをクリーンアップします。
2.  ターミナルで以下のコマンドを実行します。

    ```none
    ./gradlew clean
    ```

3.  アプリを再度ビルドして、新しいバージョンのiOSフレームワークが使用されていることを確認します。

**いつ問題が修正されますか？**

この問題はKotlin 2.0.10で修正予定です。Kotlin 2.0.10 のプレビューバージョンが[Kotlin Early Access Previewに参加する](https://kotlinlang.org/docs/eap.html)セクションで既に利用可能かどうかを確認できます。

詳細については、[YouTrackの対応する課題](https://youtrack.jetbrains.com/issue/KT-68257)を参照してください。

## Kotlin 1.9.0−1.9.25

このセクションでは、Kotlin 1.9.0−1.9.25 で非推奨サイクルを終了し、有効になる非互換の変更点について説明します。

### KotlinソースセットをKotlinコンパイルに直接追加するAPIの非推奨化 {initial-collapse-state="collapsed" collapsible="true"}

**変更点**

`KotlinCompilation.source` へのアクセスが非推奨になりました。次のようなコードは非推奨警告を生成します。

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

**現在の推奨プラクティス**

`KotlinCompilation.source(someSourceSet)` を置き換えるには、`KotlinCompilation` のデフォルトソースセットから `someSourceSet` への `dependsOn` 関係を追加します。より短く読みやすい `by getting` を使用して、ソースを直接参照することをお勧めします。ただし、すべてのケースで適用できる `KotlinCompilation.defaultSourceSet.dependsOn(someSourceSet)` を使用することもできます。

上記のコードは以下のいずれかの方法で変更できます。

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
        
        // オプション #1. より短く読みやすいので、可能な場合に使用します。
        // 通常、デフォルトのソースセット名は、ターゲット名とコンパイル名を単純に連結したものです。
        val jvmMain by getting {
            dependsOn(myCustomIntermediateSourceSet)
        }
        
        // オプション #2. より高度なアプローチを必要とするビルドスクリプトの場合に使用する汎用ソリューション:
        targets["jvm"].compilations["main"].defaultSourceSet.dependsOn(myCustomIntermediateSourceSet)
    }
}
```

**変更の適用時期**

計画されている非推奨サイクルは以下の通りです。

*   1.9.0: `KotlinComplation.source` が使用された場合に非推奨警告を導入します。
*   1.9.20: この警告をエラーに格上げします。
*   2.2.0: Kotlin Gradleプラグインから `KotlinComplation.source` を削除します。これを使用しようとすると、ビルドスクリプトのコンパイル中に「未解決の参照」エラーが発生します。

### `kotlin-js` Gradleプラグインから `kotlin-multiplatform` Gradleプラグインへの移行 {initial-collapse-state="collapsed" collapsible="true"}

**変更点**

Kotlin 1.9.0以降、`kotlin-js` Gradleプラグインは非推奨になりました。基本的に、これは `js()` ターゲットを持つ `kotlin-multiplatform` プラグインの機能を重複させ、内部で同じ実装を共有していました。このような重複は混乱を生み、Kotlinチームのメンテナンス負担を増やしました。代わりに、`js()` ターゲットを持つ `kotlin-multiplatform` Gradleプラグインへの移行をお勧めします。

**現在の推奨プラクティス**

1.  `pluginManagement {}` ブロックを使用している場合は、プロジェクトから `kotlin-js` Gradleプラグインを削除し、`settings.gradle.kts` ファイルで `kotlin-multiplatform` を適用します。

    <Tabs>
    <TabItem title="kotlin-js">

    ```kotlin
    // settings.gradle.kts:
    pluginManagement {
        plugins {
            // Remove the following line:
            kotlin("js") version "1.9.0"
        }
        
        repositories {
            // ...
        }
    }
    ```

    </TabItem>
    <TabItem title="kotlin-multiplatform">

    ```kotlin
    // settings.gradle.kts:
    pluginManagement {
        plugins {
            // Add the following line instead:
            kotlin("multiplatform") version "1.9.0"
        }
        
        repositories {
            // ...
        }
    }
    ```

    </TabItem>
    </Tabs>

    プラグインの適用方法が異なる場合は、移行手順について[Gradleドキュメント](https://docs.gradle.org/current/userguide/plugins.html)を参照してください。

2.  ソースファイルを `main` および `test` フォルダーから、同じディレクトリ内の `jsMain` および `jsTest` フォルダーに移動します。
3.  依存関係の宣言を調整します。

    *   `sourceSets {}` ブロックを使用して、それぞれのソースセットの依存関係、つまり本番環境の依存関係には `jsMain {}`、テスト依存関係には `jsTest {}` を設定することをお勧めします。
        詳細については、[依存関係の追加](multiplatform-add-dependencies.md)を参照してください。
    *   ただし、トップレベルのブロックで依存関係を宣言したい場合は、`api("group:artifact:1.0")` から `add("jsMainApi", "group:artifact:1.0")` などに宣言を変更します。

        > この場合、トップレベルの `dependencies {}` ブロックが `kotlin {}` ブロックの**後に**来ることを確認してください。そうしないと、「Configuration not found」というエラーが表示されます。
        >
        {style="note"}

    上記のコードは以下のいずれかの方法で変更できます。

    <Tabs>
    <TabItem title="kotlin-js">

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
    <TabItem title="kotlin-multiplatform">

    ```kotlin
    // build.gradle.kts:
    plugins {
        kotlin("multiplatform") version "1.9.0"
    }
    
    kotlin {
        js {
            // ...
        }
        
        // オプション #1. sourceSets {} ブロックで依存関係を宣言する:
        sourceSets {
            val jsMain by getting {
                dependencies {
                    // ここでjsプレフィックスは不要です。トップレベルのブロックからコピー&ペーストできます。
                    implementation("org.jetbrains.kotlinx:kotlinx-html:0.8.0")
                }
           }
        }
    }
    
    dependencies {
        // オプション #2. 依存関係の宣言にjsプレフィックスを追加する:
        add("jsTestImplementation", kotlin("test"))
    }
    ```

    </TabItem>
    </Tabs>

4.  `kotlin {}` ブロック内でKotlin Gradleプラグインによって提供されるDSLは、ほとんどの場合変更されません。しかし、タスクや設定などの低レベルのGradleエンティティを名前で参照していた場合、通常は `js` プレフィックスを追加して調整する必要があります。例えば、`browserTest` タスクは `jsBrowserTest` という名前で見つけることができます。

**変更の適用時期**

1.9.0では、`kotlin-js` Gradleプラグインを使用すると非推奨警告が生成されます。

### `jvmWithJava`プリセットの非推奨化 {initial-collapse-state="collapsed" collapsible="true"}

**変更点**

`targetPresets.jvmWithJava` は非推奨であり、その使用は推奨されません。

**現在の推奨プラクティス**

代わりに `jvm { withJava() }` ターゲットを使用してください。`jvm { withJava() }` に切り替えた後、`.java` ソースを含むソースディレクトリへのパスを調整する必要があることに注意してください。

例えば、デフォルト名「jvm」で `jvm` ターゲットを使用している場合：

| 変更前          | 変更後                |
|-----------------|--------------------|
| `src/main/java` | `src/jvmMain/java` |
| `src/test/java` | `src/jvmTest/java` |

**変更の適用時期**

計画されている非推奨サイクルは以下の通りです。

*   1.3.40: `targetPresets.jvmWithJava` が使用された場合に警告を導入します。
*   1.9.20: この警告をエラーに格上げします。
*   >1.9.20: `targetPresets.jvmWithJava` API を削除します。これを使用しようとすると、ビルドスクリプトのコンパイルが失敗します。

> `targetPresets` API全体が非推奨になったとしても、`jvmWithJava`プリセットは異なる非推奨スケジュールを持っています。
>
{style="note"}

### レガシーAndroidソースセットレイアウトの非推奨化 {initial-collapse-state="collapsed" collapsible="true"}

**変更点**

Kotlin 1.9.0以降、[新しいAndroidソースセットレイアウト](multiplatform-android-layout.md)がデフォルトで使用されます。レガシーレイアウトのサポートは非推奨になり、`kotlin.mpp.androidSourceSetLayoutVersion` Gradleプロパティの使用は現在、非推奨診断をトリガーします。

**変更の適用時期**

計画されている非推奨サイクルは以下の通りです。

*   <=1.9.0: `kotlin.mpp.androidSourceSetLayoutVersion=1` が使用された場合に警告を報告します。この警告は `kotlin.mpp.androidSourceSetLayoutVersion1.nowarn=true` Gradleプロパティで抑制できます。
*   1.9.20: この警告をエラーに格上げします。このエラーは**抑制できません**。
*   >1.9.20: `kotlin.mpp.androidSourceSetLayoutVersion=1` のサポートを削除します。Kotlin Gradleプラグインはこのプロパティを無視します。

### カスタム `dependsOn` を持つ `commonMain` および `commonTest` の非推奨化 {initial-collapse-state="collapsed" collapsible="true"}

**変更点**

`commonMain` と `commonTest` ソースセットは、それぞれ `main` と `test` ソースセット階層のルートを表すのが一般的です。しかし、これらのソースセットの `dependsOn` 関係を手動で設定することで、これをオーバーライドすることが可能でした。

このような設定を維持するには、マルチプラットフォームビルドの内部に関する追加の労力と知識が必要です。さらに、`commonMain` が `main` ソースセット階層のルートであるかどうかを確認するために、特定のビルドスクリプトを読み込む必要があるため、コードの可読性と再利用性が低下します。

したがって、`commonMain` および `commonTest` の `dependsOn` へのアクセスは非推奨になりました。

**現在の推奨プラクティス**

`commonMain.dependsOn(customCommonMain)` を使用する `customCommonMain` ソースセットを1.9.20に移行する必要があるとします。ほとんどの場合、`customCommonMain` は `commonMain` と同じコンパイルに参加するため、`customCommonMain` を `commonMain` にマージできます。

1.  `customCommonMain` のソースを `commonMain` にコピーします。
2.  `customCommonMain` のすべての依存関係を `commonMain` に追加します。
3.  `customCommonMain` のすべてのコンパイラオプション設定を `commonMain` に追加します。

まれに、`customCommonMain` が `commonMain` よりも多くのコンパイルに参加している場合があります。このような設定には、ビルドスクリプトの追加の低レベル構成が必要です。それがあなたのユースケースであるかどうかわからない場合、おそらくそうではありません。

それがあなたのユースケースである場合、`customCommonMain` のソースと設定を `commonMain` に移動し、その逆を行うことで、これら2つのソースセットを「スワップ」してください。

**変更の適用時期**

計画されている非推奨サイクルは以下の通りです。

*   1.9.0: `commonMain` で `dependsOn` が使用された場合に警告を報告します。
*   >=1.9.20: `commonMain` または `commonTest` で `dependsOn` が使用された場合にエラーを報告します。

### フォワード宣言への新しいアプローチ {initial-collapse-state="collapsed" collapsible="true"}

**変更点**

JetBrainsチームは、Kotlinにおけるフォワード宣言のアプローチを改訂し、その動作をより予測可能にしました。

*   フォワード宣言は `cnames` または `objcnames` パッケージを使用してのみインポートできます。
*   対応するCおよびObjective-Cのフォワード宣言へのキャストを明示的に行う必要があります。

**現在の推奨プラクティス**

*   `cstructName` フォワード宣言を宣言する `library.package` を持つCライブラリを考えてみましょう。
    以前は、`import library.package.cstructName` を使ってライブラリから直接インポートすることが可能でした。
    現在では、そのための特別なフォワード宣言パッケージを使用するしかありません: `import cnames.structs.cstructName`。
    `objcnames` も同様です。

*   2つのobjcinteropライブラリを考えてみましょう。1つは `objcnames.protocols.ForwardDeclaredProtocolProtocol` を使用し、もう1つは実際の定義を持っています。

    ```ObjC
    // First objcinterop library
    #import <Foundation/Foundation.h>
    
    @protocol ForwardDeclaredProtocol;
    
    NSString* consumeProtocol(id<ForwardDeclaredProtocol> s) {
        return [NSString stringWithUTF8String:"Protocol"];
    }
    ```

    ```ObjC
    // Second objcinterop library
    // Header:
    #import <Foundation/Foundation.h>
    @protocol ForwardDeclaredProtocol
    @end
    // Implementation:
    @interface ForwardDeclaredProtocolImpl : NSObject <ForwardDeclaredProtocol>
    @end

    id<ForwardDeclaredProtocol> produceProtocol() {
        return [ForwardDeclaredProtocolImpl new];
    }
    ```

    以前は、それらの間でオブジェクトをシームレスに転送することが可能でした。現在では、フォワード宣言には明示的な `as` キャストが必要です。

    ```kotlin
    // Kotlin code:
    fun test() {
        consumeProtocol(produceProtocol() as objcnames.protocols.ForwardDeclaredProtocolProtocol)
    }
    ```

    > `objcnames.protocols.ForwardDeclaredProtocolProtocol` へのキャストは、対応する実際のクラスからのみ可能です。そうしないとエラーが発生します。
    >
    {style="note"}

**変更の適用時期**

Kotlin 1.9.20 以降、対応するCおよびObjective-Cのフォワード宣言との間で明示的にキャストを行う必要があります。また、フォワード宣言は特別なパッケージを使用することによってのみインポートできるようになりました。

## Kotlin 1.7.0−1.8.22

このセクションでは、Kotlin 1.7.0−1.8.22 で非推奨サイクルを終了し、有効になる非互換の変更点について説明します。

### Kotlin Multiplatform GradleプラグインとGradle Javaプラグインの非推奨の互換性 {initial-collapse-state="collapsed" collapsible="true"}

**変更点**

Kotlin Multiplatform Gradleプラグインと、[Java](https://docs.gradle.org/current/userguide/java_plugin.html)、[Java Library](https://docs.gradle.org/current/userguide/java_library_plugin.html)、[Application](https://docs.gradle.org/current/userguide/application_plugin.html)のGradleプラグインとの互換性問題により、これらのプラグインを同じプロジェクトに適用すると非推奨警告が表示されるようになりました。マルチプラットフォームプロジェクト内の別のGradleプラグインがGradle Javaプラグインを適用する場合にもこの警告が表示されます。例えば、[Spring Boot Gradle Plugin](https://docs.spring.io/spring-boot/gradle-plugin/index.html) は自動的に Application プラグインを適用します。

この非推奨警告は、Kotlin MultiplatformのプロジェクトモデルとGradleのJavaエコシステムプラグインとの間の根本的な互換性の問題のために追加されました。GradleのJavaエコシステムプラグインは現在、他のプラグインが以下の可能性があることを考慮していません。

*   Javaエコシステムプラグインとは異なる方法でJVMターゲットを公開またはコンパイルする。
*   同じプロジェクト内にJVMとAndroidのように2つの異なるJVMターゲットを持つ。
*   複数の非JVMターゲットを持つ可能性のある複雑なマルチプラットフォームプロジェクト構造を持つ。

残念ながら、Gradleは現在、これらの問題に対処するためのAPIを提供していません。

以前は、Javaエコシステムプラグインとの統合を支援するために、Kotlin Multiplatformでいくつかの回避策を使用していました。しかし、これらの回避策は互換性の問題を真に解決することはなく、Gradle 8.8のリリース以降、これらの回避策はもはや不可能です。詳細については、[YouTrackの課題](https://youtrack.jetbrains.com/issue/KT-66542/Gradle-JVM-target-with-withJava-produces-a-deprecation-warning)を参照してください。

この互換性問題を正確に解決する方法はまだ不明ですが、Kotlin MultiplatformプロジェクトにおけるJavaソースコンパイルの何らかの形式のサポートを継続することをお約束します。最低限、マルチプラットフォームプロジェクト内でJavaソースのコンパイルとGradleの[`java-base`](https://docs.gradle.org/current/javadoc/org/gradle/api/plugins/JavaBasePlugin.html)プラグインの使用をサポートします。

**現在の推奨プラクティス**

マルチプラットフォームプロジェクトでこの非推奨警告が表示された場合、以下のことをお勧めします。
1.  プロジェクトでGradle Javaプラグインが実際に必要かどうかを判断します。必要ない場合は、削除を検討してください。
2.  Gradle Javaプラグインが単一のタスクのみに使用されているか確認します。その場合、あまり労力をかけずにプラグインを削除できる可能性があります。例えば、タスクがJavadoc JARファイルを作成するためにGradle Javaプラグインを使用している場合、代わりにJavadocタスクを手動で定義できます。

それ以外で、マルチプラットフォームプロジェクトでKotlin Multiplatform GradleプラグインとこれらのGradle Javaプラグインの両方を使用したい場合は、以下のことをお勧めします。

1.  Gradleプロジェクト内に別途サブプロジェクトを作成します。
2.  そのサブプロジェクトで、Java用のGradleプラグインを適用します。
3.  そのサブプロジェクトで、親のマルチプラットフォームプロジェクトへの依存関係を追加します。

> そのサブプロジェクトはマルチプラットフォームプロジェクトで**あってはならず**、マルチプラットフォームプロジェクトへの依存関係を設定するためだけに使用する必要があります。
>
{style="warning"}

例えば、`my-main-project` というマルチプラットフォームプロジェクトがあり、[Java Library](https://docs.gradle.org/current/userguide/java_library_plugin.html) Gradleプラグインを使用したいとします。

サブプロジェクト（仮に `subproject-A` とします）を作成すると、親プロジェクトの構造は以下のようになります。

```text
.
├── build.gradle
├── settings.gradle.kts
├── subproject-A
    └── build.gradle.kts
    └── src
        └── Main.java
```

サブプロジェクトの `build.gradle.kts` ファイルで、`plugins {}` ブロックにJava Libraryプラグインを適用します。

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    id("java-library")
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
plugins {
    id('java-library')
}
```

</TabItem>
</Tabs>

サブプロジェクトの `build.gradle.kts` ファイルで、親のマルチプラットフォームプロジェクトへの依存関係を追加します。

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    implementation(project(":my-main-project")) // The name of your parent multiplatform project
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
dependencies {
    implementation project(':my-main-project') // The name of your parent multiplatform project
}
```

</TabItem>
</Tabs>

これで親プロジェクトは両方のプラグインで動作するように設定されました。

### 自動生成ターゲットへの新しいアプローチ {initial-collapse-state="collapsed" collapsible="true"}

**変更点**

Gradleによって自動生成されるターゲットアクセサーは、`kotlin.targets {}` ブロック内では利用できなくなりました。代わりに `findByName("targetName")` メソッドを使用してください。

なお、このようなアクセサーは `kotlin.targets {}` の場合は、例えば `kotlin.targets.linuxX64` のように引き続き利用可能です。

**現在の推奨プラクティス**

<table>
    
<tr>
<td>変更前</td>
        <td>変更後</td>
</tr>

    
<tr>
<td>
<code-block lang="kotlin" code="kotlin {&#10;    targets {&#10;        configure(['windows',&#10;            'linux']) {&#10;        }&#10;    }&#10;}"/>
</td>
<td>
<code-block lang="kotlin" code="kotlin {&#10;    targets {&#10;        configure([findByName('windows'),&#10;            findByName('linux')]) {&#10;        }&#10;    }&#10;}"/>
</td>
</tr>

</table>

**変更の適用時期**

Kotlin 1.7.20では、`kotlin.targets {}` ブロック内でターゲットアクセサーを使用するとエラーが導入されます。

詳細については、[YouTrackの対応する課題](https://youtrack.jetbrains.com/issue/KT-47047)を参照してください。

### Gradleの入力および出力コンパイルタスクの変更点 {initial-collapse-state="collapsed" collapsible="true"}

**変更点**

Kotlinのコンパイルタスクは、`sourceCompatibility` および `targetCompatibility` 入力を持つGradleの `AbstractCompile` タスクを継承しなくなり、Kotlinユーザーのスクリプトからは利用できなくなりました。

コンパイルタスクにおけるその他の破壊的変更：

**現在の推奨プラクティス**

| 変更前                                                              | 変更後                                                                                                            |
|---------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------|
| `SourceTask.stableSources` 入力は利用できなくなりました。        | 代わりに `sources` 入力を使用してください。また、`setSource()` メソッドは引き続き利用可能です。                          |
| `sourceFilesExtensions` 入力は削除されました。                      | コンパイルタスクは引き続き `PatternFilterable` インターフェースを実装しています。Kotlinソースのフィルタリングにはそのメソッドを使用してください。 |
| `Gradle destinationDir: File` 出力は非推奨になりました。            | 代わりに `destinationDirectory: DirectoryProperty` 出力を使用してください。                                              |
| `KotlinCompile` タスクの `classpath` プロパティは非推奨になりました。 | すべてのコンパイルタスクは、コンパイルに必要なライブラリのリストに対して `libraries` 入力を使用します。              |

**変更の適用時期**

Kotlin 1.7.20では、入力が利用できなくなり、出力が置き換えられ、`classpath` プロパティが非推奨になりました。

詳細については、[YouTrackの対応する課題](https://youtrack.jetbrains.com/issue/KT-32805)を参照してください。

### コンパイルの依存関係の新しい設定名 {initial-collapse-state="collapsed" collapsible="true"}

**変更点**

Kotlin Multiplatform Gradleプラグインによって作成されるコンパイル設定に新しい名前が付けられました。

Kotlin Multiplatform プロジェクトのターゲットには、`main` と `test` の2つのデフォルトコンパイルがあります。これらの各コンパイルには、例えば `jvmMain` や `jvmTest` のように独自のデフォルトソースセットがあります。以前は、テストコンパイルとそのデフォルトソースセットの設定名が同じであったため、プラットフォーム固有の属性を持つ設定が別の設定に含まれる場合に、名前の衝突による問題が発生する可能性がありました。

現在、コンパイル設定には追加の `Compilation` 接尾辞が付き、古いハードコードされた設定名を使用するプロジェクトやプラグインはコンパイルされなくなりました。

対応するソースセットへの依存関係の設定名は変更されません。

**現在の推奨プラクティス**

<table>
    
<tr>
<td></td>
        <td>変更前</td>
        <td>変更後</td>
</tr>

    
<tr>
<td rowspan="2"><code>jvmMain</code> コンパイルの依存関係</td>
<td>
<code-block lang="kotlin" code="jvm&lt;Scope&gt;"/>
</td>
<td>
<code-block lang="kotlin" code="jvmCompilation&lt;Scope&gt;"/>
</td>
</tr>

    
<tr>
<td>
<code-block lang="kotlin" code="dependencies {&#10;    add(&quot;jvmImplementation&quot;,&#10;        &quot;foo.bar.baz:1.2.3&quot;)&#10;}"/>
</td>
<td>
<code-block lang="kotlin" code="dependencies {&#10;    add(&quot;jvmCompilationImplementation&quot;,&#10;        &quot;foo.bar.baz:1.2.3&quot;)&#10;}"/>
</td>
</tr>

    
<tr>
<td><code>jvmMain</code> ソースセットの依存関係</td>
<td colspan="2">
<code-block lang="kotlin" code="jvmMain&lt;Scope&gt;"/>
</td>
</tr>

    
<tr>
<td><code>jvmTest</code> コンパイルの依存関係</td>
<td>
<code-block lang="kotlin" code="jvmTest&lt;Scope&gt;"/>
</td>
<td>
<code-block lang="kotlin" code="jvmTestCompilation&lt;Scope&gt;"/>
</td>
</tr>

    
<tr>
<td><code>jvmTest</code> ソースセットの依存関係</td>
<td colspan="2">
<code-block lang="kotlin" code="jvmTest&lt;Scope&gt;"/>
</td>
</tr>

</table>

利用可能なスコープは `Api`、`Implementation`、`CompileOnly`、`RuntimeOnly` です。

**変更の適用時期**

Kotlin 1.8.0では、ハードコードされた文字列で古い設定名を使用するとエラーが導入されます。

詳細については、[YouTrackの対応する課題](https://youtrack.jetbrains.com/issue/KT-35916/)を参照してください。