---
title: "Kotlin 2.0.20の新機能"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_[Released: August 22, 2024](releases#release-details)_

Kotlin 2.0.20 リリースが公開されました。このバージョンには、Kotlin K2 compiler が Stable になった Kotlin 2.0.0 のパフォーマンス改善とバグ修正が含まれています。このリリースのその他のハイライトを以下に示します。

* [data class の copy 関数がコンストラクタと同じ可視性を持つようになります](#data-class-copy-function-to-have-the-same-visibility-as-constructor)
* [デフォルトのターゲット階層からのソースセットへの Static accessor が、マルチプラットフォームプロジェクトで利用できるようになりました](#static-accessors-for-source-sets-from-the-default-target-hierarchy)
* [Kotlin/Native のガベージコレクタで並行マーキングが可能になりました](#concurrent-marking-in-garbage-collector)
* [Kotlin/Wasm の `@ExperimentalWasmDsl` annotation の新しい場所](#new-location-of-experimentalwasmdsl-annotation)
* [Gradle バージョン 8.6–8.8 のサポートが追加されました](#gradle)
* [新しいオプションにより、JVM アーティファクトを Gradle プロジェクト間でクラスファイルとして共有できます](#option-to-share-jvm-artifacts-between-projects-as-class-files)
* [Compose compiler が更新されました](#compose-compiler)
* [共通の Kotlin 標準ライブラリに UUID のサポートが追加されました](#support-for-uuids-in-the-common-kotlin-standard-library)

## IDE support

2.0.20 をサポートする Kotlin プラグインは、最新の IntelliJ IDEA および Android Studio にバンドルされています。
IDE で Kotlin プラグインを更新する必要はありません。
必要なのは、ビルドスクリプトで Kotlin のバージョンを 2.0.20 に変更することだけです。

詳細については、[新しいリリースへの更新](releases#update-to-a-new-kotlin-version) を参照してください。

## Language

Kotlin 2.0.20 では、data class の一貫性を向上させ、Experimental な context receivers 機能を置き換えるための変更が導入され始めています。

### Data class copy function to have the same visibility as constructor

現在、`private` コンストラクタを使用して data class を作成すると、自動的に生成される `copy()` 関数は同じ可視性を持ちません。これが後でコードに問題を引き起こす可能性があります。今後の Kotlin リリースでは、`copy()` 関数のデフォルトの可視性がコンストラクタと同じになるように動作を変更します。この変更は、できるだけスムーズにコードを移行できるように、段階的に導入されます。

移行計画は Kotlin 2.0.20 から始まり、将来可視性が変更されるコードに警告を発行します。以下に例を示します。

```kotlin
// 2.0.20 で警告をトリガーします
data class PositiveInteger private constructor(val number: Int) {
    companion object {
        fun create(number: Int): PositiveInteger? = if (number > 0) PositiveInteger(number) else null
    }
}

fun main() {
    val positiveNumber = PositiveInteger.create(42) ?: return
    // 2.0.20 で警告をトリガーします
    val negativeNumber = positiveNumber.copy(number = -1)
    // Warning: Non-public primary constructor is exposed via the generated 'copy()' method of the 'data' class.
    // The generated 'copy()' will change its visibility in future releases.
}
```

移行計画に関する最新情報については、[YouTrack](https://youtrack.jetbrains.com/issue/KT-11914) の対応する課題を参照してください。

この動作をより詳細に制御できるように、Kotlin 2.0.20 では 2 つの annotation を導入しました。

* `@ConsistentCopyVisibility` は、後続のリリースでデフォルトになる前に、今すぐ動作を選択します。
* `@ExposedCopyVisibility` は、動作をオプトアウトし、宣言サイトで警告を抑制します。
  この annotation があっても、コンパイラは `copy()` 関数が呼び出されたときに警告を報告することに注意してください。

個々のクラスではなく、モジュール全体で 2.0.20 で新しい動作をすでに選択する場合は、`-Xconsistent-data-class-copy-visibility` コンパイラオプションを使用できます。
このオプションは、モジュール内のすべての data class に `@ConsistentCopyVisibility` annotation を追加するのと同じ効果があります。

### Phased replacement of context receivers with context parameters

Kotlin 1.6.20 では、[context receivers](whatsnew1620#prototype-of-context-receivers-for-kotlin-jvm) を
[Experimental](components-stability#stability-levels-explained) 機能として導入しました。コミュニティからのフィードバックを聞いた結果、
このアプローチを継続しないことを決定し、別の方向に向かいます。

今後の Kotlin リリースでは、context receivers は context parameters に置き換えられます。Context parameters はまだ設計段階にあり、提案は [KEEP](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters) にあります。

context parameters の実装にはコンパイラへの大幅な変更が必要なため、context receivers と context parameters を同時にサポートしないことにしました。この決定により、実装が大幅に簡素化され、不安定な動作のリスクが最小限に抑えられます。

context receivers はすでに多くの開発者によって使用されていることを理解しています。したがって、context receivers のサポートを段階的に削除します。移行計画は Kotlin 2.0.20 から始まり、`-Xcontext-receivers` コンパイラオプションで context receivers が使用されている場合にコードに警告が表示されます。以下に例を示します。

```kotlin
class MyContext

context(MyContext)
// Warning: Experimental context receivers are deprecated and will be superseded by context parameters. 
// Please don't use context receivers. You can either pass parameters explicitly or use members with extensions.
fun someFunction() {
}
```

この警告は、今後の Kotlin リリースでエラーになります。

コードで context receivers を使用する場合は、次のいずれかを使用するようにコードを移行することをお勧めします。

* 明示的なパラメータ。
<table>
<tr>
<td>
Before
</td>
<td>
After
</td>
</tr>
<tr>
<td>

   ```kotlin
   context(ContextReceiverType)
   fun someFunction() {
       contextReceiverMember()
   }
   ```
</td>
<td>

   ```kotlin
   fun someFunction(explicitContext: ContextReceiverType) {
       explicitContext.contextReceiverMember()
   }
   ```
</td>
</tr>
</table>

* Extension member functions（可能な場合）。
<table>
<tr>
<td>
Before
</td>
<td>
After
</td>
</tr>
<tr>
<td>

   ```kotlin
   context(ContextReceiverType)
   fun contextReceiverMember() = TODO()
   
   context(ContextReceiverType)
   fun someFunction() {
       contextReceiverMember()
   }
   ```
</td>
<td>

   ```kotlin
   class ContextReceiverType {
       fun contextReceiverMember() = TODO()
   }
   
   fun ContextReceiverType.someFunction() {
       contextReceiverMember()
   }
   ```
</td>
</tr>
</table>

または、コンパイラで context parameters がサポートされている Kotlin リリースまで待つこともできます。Context parameters は最初 Experimental 機能として導入されることに注意してください。

## Kotlin Multiplatform

Kotlin 2.0.20 では、マルチプラットフォームプロジェクトのソースセット管理が改善され、Gradle の最近の変更により、一部の Gradle Java プラグインとの互換性が非推奨になります。

### Static accessors for source sets from the default target hierarchy

Kotlin 1.9.20 以降、[default hierarchy template](multiplatform-hierarchy#default-hierarchy-template)
は、すべての Kotlin Multiplatform プロジェクトに自動的に適用されます。
また、デフォルト階層テンプレートのすべてのソースセットについて、Kotlin Gradle プラグインはタイプセーフな accessor を提供しました。
これにより、`by getting` または `by creating` 構造を使用せずに、指定されたすべてのターゲットのソースセットにアクセスできるようになりました。

Kotlin 2.0.20 は、IDE エクスペリエンスをさらに向上させることを目指しています。デフォルト階層テンプレートのすべてのソースセットについて、`sourceSets {}` ブロックに static accessor を提供するようになりました。
この変更により、名前でソースセットにアクセスすることがより簡単で予測可能になると考えています。

このような各ソースセットには、サンプルを含む詳細な KDoc コメントと、対応するターゲットを最初に宣言せずにソースセットにアクセスしようとした場合に警告を表示する診断メッセージが含まれています。

```kotlin
kotlin {
    jvm()
    linuxX64()
    linuxArm64()
    mingwX64()
  
    sourceSets {
        commonMain.languageSettings {
            progressiveMode = true
        }

        jvmMain { }
        linuxX64Main { }
        linuxArm64Main { }
        // Warning: accessing source set without registering the target
        iosX64Main { }
    }
}
```

<img src="/img/accessing-sourse-sets.png" alt="Accessing the source sets by name" width="700" style={{verticalAlign: 'middle'}}/>

詳細については、[Kotlin Multiplatform の階層型プロジェクト構造](multiplatform-hierarchy) を参照してください。

### Deprecated compatibility with Kotlin Multiplatform Gradle plugin and Gradle Java plugins

Kotlin 2.0.20 では、Kotlin Multiplatform Gradle プラグインと、次のいずれかの Gradle Java プラグインを同じプロジェクトに適用すると、非推奨の警告が表示されます。[Java](https://docs.gradle.org/current/userguide/java_plugin.html)、
[Java Library](https://docs.gradle.org/current/userguide/java_library_plugin.html)、および [Application](https://docs.gradle.org/current/userguide/application_plugin.html)。
また、マルチプラットフォームプロジェクトの別の Gradle プラグインが Gradle Java プラグインを適用すると、警告が表示されます。
たとえば、[Spring Boot Gradle Plugin](https://docs.spring.io/spring-boot/gradle-plugin/index.html) は、Application プラグインを自動的に適用します。

Kotlin Multiplatform のプロジェクトモデルと Gradle の Java エコシステムプラグインの根本的な互換性の問題により、この非推奨の警告を追加しました。Gradle の Java エコシステムプラグインは現在、他のプラグインが次のことを考慮に入れていません。

* Java エコシステムプラグインとは異なる方法で、JVM ターゲットの公開またはコンパイルも行う。
* 同じプロジェクトに JVM と Android など、2 つの異なる JVM ターゲットがある。
* 複数の非 JVM ターゲットが存在する可能性がある複雑なマルチプラットフォームプロジェクト構造がある。

残念ながら、Gradle は現在これらの問題に対処するための API を提供していません。

以前は、Kotlin Multiplatform で Java エコシステムプラグインの統合を支援するために、いくつかの回避策を使用していました。
ただし、これらの回避策では互換性の問題が完全に解決されることはなく、Gradle 8.8 のリリース以降、これらの回避策は不可能になりました。詳細については、[YouTrack issue](https://youtrack.jetbrains.com/issue/KT-66542/Gradle-JVM-target-with-withJava-produces-a-deprecation-warning) を参照してください。

この互換性の問題を解決する方法はまだ正確にはわかっていませんが、Kotlin Multiplatform プロジェクトでの Java ソースコンパイルの形式を継続的にサポートすることをお約束します。少なくとも、Java ソースのコンパイルと、マルチプラットフォームプロジェクト内での Gradle の [`java-base`](https://docs.gradle.org/current/javadoc/org/gradle/api/plugins/JavaBasePlugin.html) プラグインの使用をサポートします。

それまでの間、マルチプラットフォームプロジェクトでこの非推奨の警告が表示された場合は、次のことをお勧めします。
1. プロジェクトで Gradle Java プラグインが実際に必要かどうかを判断します。そうでない場合は、削除を検討してください。
2. Gradle Java プラグインが 1 つのタスクにのみ使用されているかどうかを確認します。その場合は、あまり手間をかけずにプラグインを削除できる可能性があります。たとえば、タスクが Gradle Java プラグインを使用して Javadoc JAR ファイルを作成する場合、代わりに Javadoc タスクを手動で定義できます。

それ以外の場合、Kotlin Multiplatform Gradle プラグインと、マルチプラットフォームプロジェクトの Java 用のこれらの Gradle プラグインの両方を使用する場合は、次のことをお勧めします。

1. マルチプラットフォームプロジェクトに個別のサブプロジェクトを作成します。
2. 個別のサブプロジェクトで、Java 用の Gradle プラグインを適用します。
3. 個別のサブプロジェクトで、親マルチプラットフォームプロジェクトへの依存関係を追加します。

:::note
個別のサブプロジェクトはマルチプラットフォームプロジェクト**であってはならず**、マルチプラットフォームプロジェクトへの依存関係を設定するためにのみ使用する必要があります。

たとえば、`my-main-project` というマルチプラットフォームプロジェクトがあり、
[Application](https://docs.gradle.org/current/userguide/application_plugin.html) Gradle プラグインを使用して JVM アプリケーションを実行するとします。

サブプロジェクトを作成したら、それを `subproject-A` と呼びます。親プロジェクトの構造は次のようになります。

```text
.
├── build.gradle.kts
├── settings.gradle
├── subproject-A
    └── build.gradle.kts
    └── src
        └── Main.java
```

サブプロジェクトの `build.gradle.kts` ファイルで、`plugins {}` ブロックに Application プラグインを適用します。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    id("application")
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id('application')
}
```

</TabItem>
</Tabs>

サブプロジェクトの `build.gradle.kts` ファイルで、親マルチプラットフォームプロジェクトへの依存関係を追加します。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
dependencies {
    implementation(project(":my-main-project")) // The name of your parent multiplatform project
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
dependencies {
    implementation project(':my-main-project') // The name of your parent multiplatform project
}
```

</TabItem>
</Tabs>

親プロジェクトは、両方のプラグインで動作するように設定されました。

## Kotlin/Native

Kotlin/Native は、ガベージコレクタと、Swift/Objective-C から Kotlin suspending function を呼び出すための改善を受けています。

### Concurrent marking in garbage collector

Kotlin 2.0.20 では、JetBrains チームは Kotlin/Native ランタイムパフォーマンスの向上に向けて、もう一歩前進しました。
ガベージコレクタ (GC) での並行マーキングの experimental サポートを追加しました。

デフォルトでは、GC がヒープ内のオブジェクトをマーキングするときに、アプリケーションスレッドを一時停止する必要があります。これは、Compose Multiplatform で構築された UI アプリケーションなど、レイテンシが重要なアプリケーションのパフォーマンスにとって重要な GC 一時停止時間の長さに大きく影響します。

これで、ガベージコレクションのマーキングフェーズをアプリケーションスレッドと同時に実行できます。
これにより、GC 一時停止時間が大幅に短縮され、アプリの応答性が向上するはずです。

#### How to enable

この機能は現在 [Experimental](components-stability#stability-levels-explained) です。
有効にするには、`gradle.properties` ファイルに次のオプションを設定します。

```none
kotlin.native.binary.gc=cms
```

問題が発生した場合は、課題追跡ツール [YouTrack](https://kotl.in/issue) に報告してください。

### Support for bitcode embedding removed

Kotlin 2.0.20 以降、Kotlin/Native コンパイラは bitcode embedding をサポートしなくなりました。
Bitcode embedding は Xcode 14 で非推奨になり、すべての Apple ターゲットで Xcode 15 で削除されました。

これで、framework 構成の `embedBitcode` パラメータ、
および `-Xembed-bitcode` と `-Xembed-bitcode-marker` コマンドライン引数が非推奨になりました。

以前のバージョンの Xcode をまだ使用しているが、Kotlin 2.0.20 にアップグレードする場合は、
Xcode プロジェクトで bitcode embedding を無効にします。

### Changes to GC performance monitoring with signposts

Kotlin 2.0.0 では、Xcode Instruments を使用して Kotlin/Native ガベージコレクタのパフォーマンスを監視できるようになりました
(GC)。Instruments には、GC 一時停止をイベントとして表示できる signposts ツールが含まれています。
これは、iOS アプリで GC 関連のフリーズを確認する際に役立ちます。

この機能はデフォルトで有効になっていましたが、残念ながら、
アプリケーションが Xcode Instruments と同時に実行されると、クラッシュが発生することがありました。
Kotlin 2.0.20 以降では、次のコンパイラオプションを使用して明示的なオプトインが必要です。

```none
-Xbinary=enableSafepointSignposts=true
```

GC パフォーマンス分析の詳細については、[ドキュメント](native-memory-manager#monitor-gc-performance) を参照してください。

### Ability to call Kotlin suspending functions from Swift/Objective-C on non-main threads

以前は、Kotlin/Native にはデフォルトの制限があり、Swift
および Objective-C から Kotlin suspending function を呼び出す機能がメインスレッドのみに制限されていました。Kotlin 2.0.20 では、その制限が解除され、任意の
スレッドで Swift/Objective-C から Kotlin `suspend` 関数を実行できます。

`kotlin.native.binary.objcExportSuspendFunctionLaunchThreadRestriction=none`
バイナリオプションを使用して、メインスレッド以外のスレッドのデフォルトの動作を以前に切り替えた場合は、`gradle.properties` ファイルから削除できるようになりました。

## Kotlin/Wasm

Kotlin 2.0.20 では、Kotlin/Wasm は名前付きエクスポートへの移行を継続し、`@ExperimentalWasmDsl` annotation の場所を変更します。

### Error in default export usage

名前付きエクスポートへの移行の一環として、JavaScript で Kotlin/Wasm エクスポートのデフォルトインポートを使用すると、以前は警告メッセージがコンソールに出力されていました。

名前付きエクスポートを完全にサポートするために、この警告はエラーにアップグレードされました。デフォルトインポートを使用すると、次のエラーメッセージが表示されます。

```text
Do not use default import. Use the corresponding named import instead.
```

この変更は、名前付きエクスポートに移行するための非推奨サイクルの一部です。各フェーズで予想されることは次のとおりです。

* **バージョン 2.0.0**: デフォルトエクスポートを介してエンティティをエクスポートすることは非推奨であることを説明する警告メッセージがコンソールに出力されます。
* **バージョン 2.0.20**: エラーが発生し、対応する名前付きインポートの使用が要求されます。
* **バージョン 2.1.0**: デフォルトインポートの使用は完全に削除されます。

### New location of ExperimentalWasmDsl annotation

以前は、WebAssembly (Wasm) 機能の `@ExperimentalWasmDsl` annotation は、Kotlin Gradle プラグイン内の次の場所に配置されていました。

```Kotlin
org.jetbrains.kotlin.gradle.targets.js.dsl.ExperimentalWasmDsl
```

2.0.20 では、`@ExperimentalWasmDsl` annotation の場所が次の場所に変更されました。

```Kotlin
org.jetbrains.kotlin.gradle.ExperimentalWasmDsl
```

以前の場所は非推奨になり、解決されていない参照でビルドが失敗する可能性があります。

`@ExperimentalWasmDsl` annotation の新しい場所を反映するには、Gradle ビルドスクリプトの import ステートメントを更新します。
新しい `@ExperimentalWasmDsl` の場所に明示的な import を使用します。

```kotlin
import org.jetbrains.kotlin.gradle.ExperimentalWasmDsl
```

または、古いパッケージからこのスター import ステートメントを削除します。

```kotlin
import org.jetbrains.kotlin.gradle.targets.js.dsl.*
```

## Kotlin/JS

Kotlin/JS は、JavaScript での static メンバーのサポートと、JavaScript から Kotlin コレクションを作成するためのいくつかの Experimental 機能を紹介します。

### Support for using Kotlin static members in JavaScript

この機能は [Experimental](components-stability#stability-levels-explained) です。いつでも削除または変更される可能性があります。
評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issue/KT-18891/JS-provide-a-way-to-declare-static-members-JsStatic) でフィードバックをお待ちしております。

Kotlin 2.0.20 以降では、`@JsStatic` annotation を使用できます。これは [@JvmStatic](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-static/) と同様に機能します
ターゲット宣言に対して追加の static メソッドを生成するようにコンパイラに指示します。これにより、Kotlin コードの static
メンバーを JavaScript で直接使用できます。

`@JsStatic` annotation は、named object で定義された関数、およびクラスとインターフェイス内で宣言された companion object で使用できます。コンパイラは、オブジェクトの static メソッドと、オブジェクト自体のインスタンスメソッドの両方を生成します。以下に例を示します。

```kotlin
class C {
    companion object {
        @JsStatic
        fun callStatic() {}
        fun callNonStatic() {}
    }
}
```

これで、`callStatic()` は JavaScript で static になり、`callNonStatic()` は static になりません。

```javascript
C.callStatic();              // Works, accessing the static function
C.callNonStatic();           // Error, not a static function in the generated JavaScript
C.Companion.callStatic();    // Instance method remains
C.Companion.callNonStatic(); // The only way it works
```

`@JsStatic` annotation をオブジェクトまたは companion object のプロパティに適用して、その getter および setter メソッドをそのオブジェクトまたは companion object を含むクラスの static メンバーにすることもできます。

### Ability to create Kotlin collections from JavaScript

この機能は [Experimental](components-stability#stability-levels-explained) です。いつでも削除または変更される可能性があります。
評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issue/KT-69133/Kotlin-JS-Add-support-for-collection-instantiation-in-JavaScript) でフィードバックをお待ちしております。

Kotlin 2.0.0 では、Kotlin コレクションを JavaScript (および TypeScript) にエクスポートする機能が導入されました。これで、JetBrains チームは
コレクションの相互運用性を向上させるためのもう 1 つのステップを実行します。Kotlin 2.0.20 以降では、
JavaScript/TypeScript 側から Kotlin コレクションを直接作成できます。

JavaScript から Kotlin コレクションを作成し、エクスポートされたコンストラクタまたは関数への引数として渡すことができます。
エクスポートされた宣言内でコレクションに言及するとすぐに、Kotlin は JavaScript/TypeScript で使用可能なコレクションのファクトリを生成します。

次のエクスポートされた関数を見てください。

```kotlin
// Kotlin
@JsExport
fun consumeMutableMap(map: MutableMap<String, Int>)
```

`MutableMap` コレクションが言及されているため、Kotlin は JavaScript/TypeScript から利用可能なファクトリメソッドを持つオブジェクトを生成します。
このファクトリメソッドは、JavaScript `Map` から `MutableMap` を作成します。

```javascript
// JavaScript
import { consumeMutableMap } from "an-awesome-kotlin-module"
import { KtMutableMap } from "an-awesome-kotlin-module/kotlin-kotlin-stdlib"

consumeMutableMap(
    KtMutableMap.fromJsMap(new Map([["First", 1], ["Second", 2]]))
)
```

この機能は、`Set`、`Map`、および `List` Kotlin コレクションタイプとその mutable な対応物で使用できます。

## Gradle

Kotlin 2.0.20 は、Gradle 6.8.3 ～ 8.6 と完全に互換性があります。Gradle 8.7 および 8.8 もサポートされていますが、
例外が 1 つだけあります。Kotlin Multiplatform Gradle プラグインを使用している場合、マルチプラットフォームプロジェクトで
JVM ターゲットの `withJava()` 関数を呼び出すと、非推奨の警告が表示されることがあります。この問題はできるだけ早く修正する予定です。

詳細については、[YouTrack](https://youtrack.jetbrains.com/issue/KT-66542/Gradle-JVM-target-with-withJava-produces-a-deprecation-warning) の課題を参照してください。

最新の Gradle リリースまでの Gradle バージョンも使用できますが、その場合は、
非推奨の警告が発生したり、一部の新しい Gradle 機能が動作しない可能性があることに注意してください。

このバージョンでは、JVM 履歴ファイルに基づく古い incremental compilation アプローチの非推奨プロセスを開始するなどの変更が加えられています。また、プロジェクト間で JVM アーティファクトを共有する新しい方法も導入されています。

### Deprecated incremental compilation based on JVM history files

Kotlin 2.0.20 では、JVM 履歴ファイルに基づく incremental compilation アプローチは非推奨となり、Kotlin 1.8.20 以降デフォルトで有効になっている新しい incremental compilation アプローチが推奨されます。

JVM 履歴ファイルに基づく incremental compilation アプローチには、
[Gradle のビルドキャッシュ](https://docs.gradle.org/current/userguide/build_cache.html) と連携しない、コンパイル回避をサポートしないなどの制限がありました。
対照的に、新しい incremental compilation アプローチはこれらの制限を克服し、導入以来良好に機能しています。

新しい incremental compilation アプローチが過去 2 つの主要な Kotlin リリースでデフォルトで使用されていることを考えると、
Kotlin 2.0.20 では `kotlin.incremental.useClasspathSnapshot` Gradle プロパティは非推奨になります。
したがって、オプトアウトするために使用すると、非推奨の警告が表示されます。

### Option to share JVM artifacts between projects as class files

この機能は [Experimental](components-stability#stability-levels-explained) です。
いつでも削除または変更される可能性があります。評価目的でのみ使用してください。
[YouTrack](https://youtrack.jetbrains.com/issue/KT-61861/Gradle-Kotlin-compilations-depend-on-packed-artifacts) でフィードバックをお待ちしております。
オプトインが必要です (詳細は下記を参照)。

Kotlin 2.0.20 では、Kotlin/JVM コンパイルの出力 (JAR ファイルなど) がプロジェクト間で共有される方法を変更する新しいアプローチを導入します。このアプローチでは、Gradle の `apiElements` 構成に、コンパイル済みの `.class` ファイルを含むディレクトリへのアクセスを提供する 2 番目のバリアントが追加されました。構成すると、プロジェクトはコンパイル中に圧縮された JAR アーティファクトを要求する代わりに、このディレクトリを使用します。これにより、特に incremental build の場合、JAR ファイルが圧縮および解凍される回数が削減されます。

テストでは、この新しいアプローチにより、Linux および macOS ホストのビルドパフォーマンスが向上する可能性があることが示されています。
ただし、Windows ホストでは、Windows がファイルの操作時に I/O 操作を処理する方法により、パフォーマンスが低下することが確認されています。

この新しいアプローチを試すには、`gradle.properties` ファイルに次のプロパティを追加します。

```none
kotlin.jvm.addClassesVariant=true
```

デフォルトでは、このプロパティは `false` に設定されており、Gradle の `apiElements` バリアントは圧縮された JAR アーティファクトを要求します。

Gradle には、Java のみのプロジェクトで使用できる関連プロパティがあり、コンパイル済みの `.class` ファイルを含むディレクトリ**ではなく**、コンパイル中に圧縮された JAR アーティファクトのみを公開します。

```none
org.gradle.java.compile-classpath-packaging=true
```

このプロパティとその目的の詳細については、
[Gradle のドキュメント](https://docs.gradle.org/current/userguide/java_library_plugin.html#sub:java_library_known_issues_windows_performance) を参照してください (「巨大なマルチプロジェクトでの Windows でのビルドパフォーマンスの大幅な低下」)。

:::

この新しいアプローチに関するフィードバックをお待ちしております。使用中にパフォーマンスの向上に気付きましたか？
[YouTrack](https://youtrack.jetbrains.com/issue/KT-61861/Gradle-Kotlin-compilations-depend-on-packed-artifacts) にコメントを追加してお知らせください。

### Aligned dependency behavior of Kotlin Gradle plugin with java-test-fixtures plugin

Kotlin 2.0.20 より前は、プロジェクトで [`java-test-fixtures` プラグイン](https://docs.gradle.org/current/userguide/java_testing.html#sec:java_test_fixtures) を使用している場合、依存関係の伝播方法に Gradle と Kotlin Gradle プラグインの間に違いがありました。

Kotlin Gradle プラグインは依存関係を伝播しました。

* `java-test-fixtures` プラグインの `implementation` および `api` 依存関係タイプから `test` ソースセットコンパイルクラスパスへ。
* メインソースセットの `implementation` および `api` 依存関係タイプから `java-test-fixtures` プラグインのソースセットコンパイルクラスパスへ。

ただし、Gradle は `api` 依存関係タイプでのみ依存関係を伝播しました。

この動作の違いにより、一部のプロジェクトではクラスパスでリソースファイルが複数回検出されました。

Kotlin 2.0.20 の時点では、Kotlin Gradle プラグインの動作は Gradle の `java-test-fixtures` プラグインと一致しているため、
この問題はこれや他の Gradle プラグインでは発生しなくなりました。

この変更の結果、`test` および `testFixtures` ソースセットの一部の依存関係にアクセスできなくなる場合があります。
このようになった場合は、依存関係の宣言タイプを `implementation` から `api` に変更するか、影響を受けるソースセットに新しい依存関係宣言を追加してください。

### Added task dependency for rare cases when the compile task lacks one on an artifact

2.0.20 より前は、コンパイルタスクにそのアーティファクト入力の 1 つに対するタスク依存関係がないシナリオがあることがわかりました。これは、依存するコンパイルタスクの結果が不安定であることを意味しました。これは、アーティファクトが間に合うように生成されたり、生成されなかったりするためです。

この問題を解決するために、Kotlin Gradle プラグインは、これらのシナリオで必要なタスク依存関係を自動的に追加するようになりました。

非常にまれなケースですが、この新しい動作により、循環依存関係エラーが発生する可能性があることがわかりました。
たとえば、1 つのコンパイルがもう 1 つのすべての内部宣言を確認でき、生成されたアーティファクトが両方のコンパイルタスクの出力に依存している複数のコンパイルがある場合、次のようなエラーが表示される可能性があります。

```none
FAILURE: Build failed with an exception.

What went wrong:
Circular dependency between the following tasks:
:lib:compileKotlinJvm
--- :lib:jvmJar
     \--- :lib:compileKotlinJvm (*)
(*) - details omitted (listed previously)
```

この循環依存関係エラーを修正するために、Gradle プロパティを追加しました。`archivesTaskOutputAsFriendModule`。

デフォルトでは、このプロパティはタスク依存関係を追跡するために `true` に設定されています。コンパイル
タスクでのアーティファクトの使用を無効にして、タスク依存関係が不要になるようにするには、`gradle.properties` ファイルに次を追加します。

```kotlin
kotlin.build.archivesTaskOutputAsFriendModule=false
```

詳細については、[YouTrack](https://youtrack.jetbrains.com/issue/KT-69330) の課題を参照してください。

## Compose compiler

Kotlin 2.0.20 では、Compose compiler がいくつかの改善を受けました。

### Fix for the unnecessary recompositions issue introduced in 2.0.0

Compose compiler 2.0.0 には、JVM 以外のターゲットを持つマルチプラットフォームプロジェクトの型の安定性を誤って推論する問題があります。これにより、不要な (または無限の) 再コンポーズが発生する可能性があります。Kotlin 2.0.0 用に作成された Compose アプリをバージョン 2.0.10 以降に更新することを強くお勧めします。

アプリが Compose compiler 2.0.10 以降で構築されているが、バージョン 2.0.0 で構築された依存関係を使用している場合、これらの古い依存関係は依然として再コンポーズの問題を引き起こす可能性があります。
これを防ぐために、アプリと同じ Compose compiler で構築されたバージョンに依存関係を更新してください。

### New way to configure compiler options

トップレベルのパラメータの変更を回避するために、新しいオプション構成メカニズムを導入しました。
Compose compiler チームが `composeCompiler {}` ブロックのトップレベルエントリを作成または削除してテストすることは困難です。
そのため、strong skipping mode や non-skipping group optimizations などのオプションは、`featureFlags` プロパティを介して有効になりました。
このプロパティは、最終的にデフォルトになる新しい Compose compiler オプションをテストするために使用されます。

この変更は、Compose compiler Gradle プラグインにも適用されました。今後 feature flags を構成するには、次の構文を使用します (このコードはすべてのデフォルト値を反転します)。

```kotlin
composeCompiler {
    featureFlags = setOf(
        ComposeFeatureFlag.IntrinsicRemember.disabled(),
        ComposeFeatureFlag.OptimizeNonSkippingGroups,
        ComposeFeatureFlag.StrongSkipping.disabled()
    )
}
```

または、Compose compiler を直接構成する場合は、次の構文を使用します。

```text
-P plugin:androidx.compose.compiler.plugins.kotlin:featureFlag=IntrinsicRemember
```

したがって、`enableIntrinsicRemember`、`enableNonSkippingGroupOptimization`、および `enableStrongSkippingMode` プロパティは非推奨になりました。

この新しいアプローチに関するフィードバックがあれば、[YouTrack](https://youtrack.jetbrains.com/issue/KT-68651/Compose-provide-a-single-place-in-extension-to-configure-all-compose-flags) でお寄せください。

### Strong skipping mode enabled by default

Compose compiler の strong skipping mode がデフォルトで有効になりました。

Strong skipping mode は、スキップできる composable のルールを変更する Compose compiler 構成オプションです。
strong skipping mode を有効にすると、不安定なパラメータを持つ composable もスキップできるようになりました。
strong skipping mode は、composable 関数で使用されるラムダも自動的に記憶するため、再コンポーズを回避するためにラムダを `remember` でラップする必要はなくなりました。

詳細については、[strong skipping mode ドキュメント](https://developer.android.com/develop/ui/compose/performance/stability/strongskipping) を参照してください。

### Composition trace markers enabled by default

コンパイラプラグインのデフォルト値と一致するように、`includeTraceMarkers` オプションが Compose compiler Gradle プラグインでデフォルトで `true` に設定されるようになりました。これにより、Android Studio システムトレースプロファイラで composable 関数を表示できます。構成トレースの詳細については、この [Android Developers ブログ投稿](https://medium.com/androiddevelopers/jetpack-compose-composition-tracing-9ec2b3aea535) を参照してください。

### Non-skipping group optimizations

このリリースには新しいコンパイラオプションが含まれています。有効にすると、スキップ不可および再起動不可の composable 関数は、composable の本体の周りにグループを生成しなくなります。これにより、割り当てが減り、パフォーマンスが向上します。
このオプションは experimental であり、デフォルトでは無効になっていますが、[上記](#new-way-to-configure-compiler-options) に示すように、feature flag `OptimizeNonSkippingGroups` で有効にできます。

この feature flag は、より広範なテストに対応できるようになりました。この機能を有効にする際に発生した問題は、[Google issue tracker](https://goo.gle/compose-feedback) に提出できます。

### Support for default parameters in abstract composable functions

抽象 composable 関数にデフォルトのパラメータを追加できるよう