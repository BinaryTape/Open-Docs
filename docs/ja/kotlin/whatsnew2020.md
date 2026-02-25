[//]: # (title: Kotlin 2.0.20 の新機能)

<web-summary>Kotlin 2.0.20 のリリースノートを読み、新しい言語機能、Kotlin Multiplatform、JVM、Native、JS、Wasm へのアップデート、および Gradle と Maven のビルドツールサポートについて確認してください。</web-summary>

_[リリース日: 2024年8月22日](releases.md#release-history)_

Kotlin 2.0.20 がリリースされました！このバージョンには、Kotlin K2 コンパイラが Stable（安定版）として発表された Kotlin 2.0.0 に対するパフォーマンスの向上とバグ修正が含まれています。以下は、このリリースの主なハイライトです。

* [data class の copy 関数の可視性をコンストラクタと同じにする](#data-class-copy-function-to-have-the-same-visibility-as-constructor)
* [マルチプラットフォームプロジェクトにおいて、デフォルトのターゲット階層からのソースセットに対する静的アクセサが利用可能に](#static-accessors-for-source-sets-from-the-default-target-hierarchy)
* [Kotlin/Native のガベージコレクタでコンカレントマーキングが可能に](#concurrent-marking-in-garbage-collector)
* [Kotlin/Wasm における `@ExperimentalWasmDsl` アノテーションの場所が変更](#new-location-of-experimentalwasmdsl-annotation)
* [Gradle バージョン 8.6–8.8 のサポートを追加](#gradle)
* [Gradle プロジェクト間で JVM アーティファクトをクラスファイルとして共有できる新しいオプション](#option-to-share-jvm-artifacts-between-projects-as-class-files)
* [Compose コンパイラのアップデート](#compose-compiler)
* [共通の Kotlin 標準ライブラリへの UUID サポートの追加](#support-for-uuids-in-the-common-kotlin-standard-library)

> Kotlin のリリースサイクルについては、[Kotlin のリリースプロセス](releases.md)を参照してください。
>
{style="tip"}

## IDE サポート

2.0.20 をサポートする Kotlin プラグインは、最新の IntelliJ IDEA および Android Studio に同梱されています。
IDE で Kotlin プラグインを更新する必要はありません。
ビルドスクリプト内の Kotlin バージョンを 2.0.20 に変更するだけで済みます。

詳細は [新しいリリースへのアップデート](releases.md#update-to-a-new-kotlin-version) を参照してください。

## 言語 (Language)

Kotlin 2.0.20 では、データクラス（data class）の一貫性を向上させる変更と、実験的なコンテキストレシーバー（context receivers）機能を置き換えるための変更が導入され始めています。

### data class の copy 関数の可視性をコンストラクタと同じにする

現在、`private` なコンストラクタを使用してデータクラスを作成しても、自動生成される `copy()` 関数は同じ可視性を持ちません。これは、後でコード内で問題を引き起こす可能性があります。将来の Kotlin リリースでは、`copy()` 関数のデフォルトの可視性をコンストラクタと同じにする挙動を導入します。この変更は、コードの移行を可能な限りスムーズに行えるよう、段階的に導入されます。

移行プランは Kotlin 2.0.20 から始まり、将来的に可視性が変更される箇所に対してコード内で警告を発行します。例えば：

```kotlin
// 2.0.20 で警告が発生します
data class PositiveInteger private constructor(val number: Int) {
    companion object {
        fun create(number: Int): PositiveInteger? = if (number > 0) PositiveInteger(number) else null
    }
}

fun main() {
    val positiveNumber = PositiveInteger.create(42) ?: return
    // 2.0.20 で警告が発生します
    val negativeNumber = positiveNumber.copy(number = -1)
    // Warning: Non-public primary constructor is exposed via the generated 'copy()' method of the 'data' class.
    // The generated 'copy()' will change its visibility in future releases.
}
```

移行プランに関する最新情報については、[YouTrack](https://youtrack.jetbrains.com/issue/KT-11914) の対応するイシューを参照してください。

この動作をより細かく制御するために、Kotlin 2.0.20 では 2 つのアノテーションを導入しました。

* `@ConsistentCopyVisibility`: 後のリリースでデフォルトになる前に、今すぐこの挙動をオプトイン（有効化）します。
* `@ExposedCopyVisibility`: この挙動をオプトアウト（無効化）し、宣言場所での警告を抑制します。
  なお、このアノテーションを使用しても、`copy()` 関数が呼び出された際にはコンパイラが依然として警告を報告します。

個別のクラスではなく、モジュール全体で 2.0.20 から新しい挙動をオプトインしたい場合は、`-Xconsistent-data-class-copy-visibility` コンパイラオプションを使用できます。
このオプションは、モジュール内のすべてのデータクラスに `@ConsistentCopyVisibility` アノテーションを追加するのと同じ効果があります。

### コンテキストレシーバーをコンテキストパラメータで段階的に置き換える

Kotlin 1.6.20 では、[コンテキストレシーバー (context receivers)](whatsnew1620.md#prototype-of-context-receivers-for-kotlin-jvm) を [Experimental (実験的)](components-stability.md#stability-levels-explained) な機能として導入しました。コミュニティからのフィードバックを検討した結果、このアプローチを継続せず、別の方向性を採用することに決定しました。

将来の Kotlin リリースでは、コンテキストレシーバーはコンテキストパラメータ (context parameters) に置き換えられます。コンテキストパラメータはまだ設計段階にあり、提案内容は [KEEP](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md) で確認できます。

コンテキストパラメータの実装にはコンパイラへの大幅な変更が必要なため、コンテキストレシーバーとコンテキストパラメータを同時にサポートしないことにしました。この決定により、実装が大幅に簡素化され、不安定な動作のリスクが最小限に抑えられます。

コンテキストレシーバーがすでに多くの開発者に使用されていることは認識しています。そのため、コンテキストレシーバーのサポートを段階的に削除していきます。移行プランは Kotlin 2.0.20 から始まり、`-Xcontext-receivers` コンパイラオプションを使用してコンテキストレシーバーが使用されている場合に警告が発行されます。例えば：

```kotlin
class MyContext

context(MyContext)
// Warning: Experimental context receivers are deprecated and will be superseded by context parameters. 
// Please don't use context receivers. You can either pass parameters explicitly or use members with extensions.
fun someFunction() {
}
```

この警告は、将来の Kotlin リリースでエラーになります。

コード内でコンテキストレシーバーを使用している場合は、以下のいずれかを使用するようにコードを移行することをお勧めします。

* 明示的なパラメータ (Explicit parameters)

   <table>
      <tr>
          <td>Before (移行前)</td>
          <td>After (移行後)</td>
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

* 拡張メンバー関数 (Extension member functions) （可能な場合）

   <table>
      <tr>
          <td>Before (移行前)</td>
          <td>After (移行後)</td>
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

あるいは、コンパイラでコンテキストパラメータがサポートされる Kotlin リリースまで待つこともできます。なお、コンテキストパラメータは当初、実験的な機能として導入される予定です。

## Kotlin Multiplatform

Kotlin 2.0.20 では、マルチプラットフォームプロジェクトにおけるソースセット管理の改善が行われたほか、Gradle の最近の変更に伴い、一部の Gradle Java プラグインとの互換性が非推奨となりました。

### デフォルトのターゲット階層からのソースセットに対する静的アクセサ

Kotlin 1.9.20 以降、[デフォルトの階層テンプレート](https://kotlinlang.org/docs/multiplatform/multiplatform-hierarchy.html#default-hierarchy-template) がすべての Kotlin Multiplatform プロジェクトに自動的に適用されるようになりました。
また、デフォルトの階層テンプレートからのすべてのソースセットに対して、Kotlin Gradle プラグインが型安全なアクセサを提供しました。
これにより、`by getting` や `by creating` などの構成を使用することなく、指定されたすべてのターゲットのソースセットにアクセスできるようになりました。

Kotlin 2.0.20 では、IDE エクスペリエンスをさらに向上させることを目指しています。今回、デフォルトの階層テンプレートからのすべてのソースセットに対して、`sourceSets {}` ブロック内で静的アクセサが提供されるようになりました。
この変更により、名前によるソースセットへのアクセスがより簡単かつ予測可能になると考えています。

それぞれのソースセットには、サンプルを含む詳細な KDoc コメントと、対応するターゲットを最初に宣言せずにソースセットにアクセスしようとした場合の警告メッセージが表示されるようになりました。

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
        // 警告：ターゲットを登録せずにソースセットにアクセスしています
        iosX64Main { }
    }
}
```

![名前によるソースセットへのアクセス](accessing-sourse-sets.png){width=700}

[Kotlin Multiplatform における階層的なプロジェクト構造](https://kotlinlang.org/docs/multiplatform/multiplatform-hierarchy.html)についての詳細はこちらをご覧ください。

### Kotlin Multiplatform Gradle プラグインと Gradle Java プラグインの互換性の非推奨化

Kotlin 2.0.20 では、同じプロジェクトに Kotlin Multiplatform Gradle プラグインと、以下の Gradle Java プラグインのいずれかを適用した場合に非推奨警告が導入されます：[Java](https://docs.gradle.org/current/userguide/java_plugin.html)、[Java Library](https://docs.gradle.org/current/userguide/java_library_plugin.html)、[Application](https://docs.gradle.org/current/userguide/application_plugin.html)。
この警告は、マルチプラットフォームプロジェクト内の別の Gradle プラグインが Gradle Java プラグインを適用している場合にも表示されます。
例えば、[Spring Boot Gradle Plugin](https://docs.spring.io/spring-boot/gradle-plugin/index.html) は自動的に Application プラグインを適用します。

この非推奨警告を追加したのは、Kotlin Multiplatform のプロジェクトモデルと Gradle の Java エコシステムプラグインとの間に根本的な互換性の問題があるためです。Gradle の Java エコシステムプラグインは現在、他のプラグインが以下を行う可能性を考慮していません。

* Java エコシステムプラグインとは異なる方法で、JVM ターゲット向けに公開またはコンパイルも行う。
* 同じプロジェクト内に JVM と Android など、2 つの異なる JVM ターゲットを持つ。
* 複数の非 JVM ターゲットを持つ可能性のある、複雑なマルチプラットフォームプロジェクト構造を持つ。

残念ながら、現在のところ Gradle はこれらの問題に対処するための API を提供していません。

これまで Kotlin Multiplatform では、Java エコシステムプラグインとの統合を助けるためにいくつかの回避策を使用してきました。
しかし、これらの回避策で互換性の問題が真に解決されることはなく、Gradle 8.8 のリリース以降、これらの回避策は不可能になりました。詳細については、[YouTrack のイシュー](https://youtrack.jetbrains.com/issue/KT-66542/Gradle-JVM-target-with-withJava-produces-a-deprecation-warning)を参照してください。

この互換性問題をどのように解決するかはまだ正確には分かっていませんが、Kotlin Multiplatform プロジェクトにおいて何らかの形で Java ソースのコンパイルをサポートし続けることに取り組んでいます。少なくとも、マルチプラットフォームプロジェクト内での Java ソースのコンパイルと、Gradle の [`java-base`](https://docs.gradle.org/current/javadoc/org/gradle/api/plugins/JavaBasePlugin.html) プラグインの使用についてはサポートする予定です。

それまでの間、マルチプラットフォームプロジェクトでこの非推奨警告が表示された場合は、以下の対応をお勧めします。
1. プロジェクトに本当に Gradle Java プラグインが必要かどうかを確認してください。不要であれば、削除することを検討してください。
2. Gradle Java プラグインが単一のタスクのためにのみ使用されているか確認してください。そうであれば、あまり手間をかけずにプラグインを削除できる可能性があります。例えば、タスクが Javadoc JAR ファイルを作成するために Gradle Java プラグインを使用している場合は、代わりに Javadoc タスクを手動で定義できます。

もし Kotlin Multiplatform Gradle プラグインとこれらの Java 用 Gradle プラグインの両方をマルチプラットフォームプロジェクトで使用したい場合は、以下の方法をお勧めします。

1. マルチプラットフォームプロジェクト内に別のサブプロジェクトを作成します。
2. その別のサブプロジェクトで、Java 用の Gradle プラグインを適用します。
3. その別のサブプロジェクトで、親のマルチプラットフォームプロジェクトへの依存関係を追加します。

> その別のサブプロジェクトはマルチプラットフォームプロジェクトであっては**ならず**、マルチプラットフォームプロジェクトへの依存関係を設定するためだけにそれを使用しなければなりません。
>
{style="warning"}

例えば、`my-main-project` というマルチプラットフォームプロジェクトがあり、JVM アプリケーションを実行するために [Application](https://docs.gradle.org/current/userguide/application_plugin.html) Gradle プラグインを使用したいとします。

サブプロジェクト（ここでは `subproject-A` と呼びます）を作成した後の、親プロジェクトの構造は以下のようになります。

```text
.
├── build.gradle.kts
├── settings.gradle
├── subproject-A
    └── build.gradle.kts
    └── src
        └── Main.java
```

サブプロジェクトの `build.gradle.kts` ファイル内の `plugins {}` ブロックで、Application プラグインを適用します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    id("application")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id('application')
}
```

</tab>
</tabs>

サブプロジェクトの `build.gradle.kts` ファイルで、親のマルチプラットフォームプロジェクトへの依存関係を追加します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    implementation(project(":my-main-project")) // 親マルチプラットフォームプロジェクトの名前
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    implementation project(':my-main-project') // 親マルチプラットフォームプロジェクトの名前
}
```

</tab>
</tabs>

これで、親プロジェクトが両方のプラグインと連携できるように設定されました。

## Kotlin/Native

Kotlin/Native では、ガベージコレクタの改善と、Swift/Objective-C からの Kotlin の suspend 関数の呼び出しに関する改善が行われました。

### ガベージコレクタでのコンカレントマーキング

Kotlin 2.0.20 では、JetBrains チームは Kotlin/Native のランタイムパフォーマンス向上のために新たな一歩を踏み出しました。
ガベージコレクタ (GC) におけるコンカレントマーキング（並行マーキング）の実験的サポートを追加しました。

デフォルトでは、GC がヒープ内のオブジェクトをマーキングする際、アプリケーションスレッドを一時停止する必要があります。これは GC の停止時間（ポーズタイム）に大きく影響し、Compose Multiplatform で構築された UI アプリケーションなど、レイテンシに敏感なアプリケーションのパフォーマンスにとって重要です。

今回、ガベージコレクションのマーキングフェーズをアプリケーションスレッドと同時に実行できるようになりました。
これにより GC ポーズタイムが大幅に短縮され、アプリの応答性が向上することが期待されます。

#### 有効化する方法

この機能は現在 [Experimental (実験的)](components-stability.md#stability-levels-explained) です。
有効にするには、`gradle.properties` ファイルに以下のオプションを設定してください。

```none
kotlin.native.binary.gc=cms
```

問題が発生した場合は、イシュートラッカー [YouTrack](https://kotl.in/issue) に報告してください。

### ビットコード埋め込みサポートの削除

Kotlin 2.0.20 以降、Kotlin/Native コンパイラはビットコード埋め込み（bitcode embedding）をサポートしなくなりました。
ビットコード埋め込みは Xcode 14 で非推奨となり、Xcode 15 ではすべての Apple ターゲットから削除されました。

これに伴い、フレームワーク設定の `embedBitcode` パラメータ、および `-Xembed-bitcode` と `-Xembed-bitcode-marker` コマンドライン引数は非推奨となりました。

依然として以前のバージョンの Xcode を使用しているものの、Kotlin 2.0.20 にアップグレードしたい場合は、Xcode プロジェクトでビットコード埋め込みを無効にしてください。

### signposts による GC パフォーマンス監視の変更

Kotlin 2.0.0 では、Xcode Instruments を通じて Kotlin/Native のガベージコレクタ (GC) のパフォーマンスを監視できるようになりました。Instruments には signposts ツールが含まれており、GC による停止をイベントとして表示できます。これは、iOS アプリで GC 関連のフリーズを確認する際に役立ちます。

この機能はデフォルトで有効になっていましたが、残念ながら、アプリケーションを Xcode Instruments と同時に実行した際にクラッシュを引き起こすことがありました。
Kotlin 2.0.20 以降、この機能を使用するには、以下のコンパイラオプションによる明示的なオプトインが必要になります。

```none
-Xbinary=enableSafepointSignposts=true
```

GC パフォーマンス分析の詳細は [ドキュメント](native-memory-manager.md#monitor-gc-performance) を参照してください。

### メインスレッド以外から Swift/Objective-C で Kotlin suspend 関数を呼び出す機能

これまで、Kotlin/Native ではデフォルトの制限により、Swift および Objective-C から Kotlin の suspend 関数を呼び出せるのはメインスレッドのみに制限されていました。Kotlin 2.0.20 ではこの制限が解除され、任意のスレッドから Swift/Objective-C で Kotlin の `suspend` 関数を実行できるようになりました。

以前にバイナリオプション `kotlin.native.binary.objcExportSuspendFunctionLaunchThreadRestriction=none` でメインスレッド以外のデフォルトの挙動を切り替えていた場合は、`gradle.properties` ファイルからその設定を削除できるようになります。

## Kotlin/Wasm

Kotlin 2.0.20 では、Kotlin/Wasm は名前付きエクスポート (named exports) への移行を継続し、`@ExperimentalWasmDsl` アノテーションの場所を変更しました。

### デフォルトエクスポート使用時のエラー

名前付きエクスポートへの移行の一環として、JavaScript で Kotlin/Wasm のエクスポートに対してデフォルトインポートを使用した場合に、警告メッセージが以前はコンソールに出力されていました。

名前付きエクスポートを完全にサポートするため、この警告はエラーにアップグレードされました。デフォルトインポートを使用すると、次のエラーメッセージが表示されます。

```text
Do not use default import. Use the corresponding named import instead.
```

この変更は、名前付きエクスポートへの移行に向けた非推奨サイクルの段階の 1 つです。各フェーズで期待される内容は以下の通りです。

* **バージョン 2.0.0**: デフォルトエクスポートを介したエンティティのエクスポートが非推奨であることを説明する警告メッセージがコンソールに出力されます。
* **バージョン 2.0.20**: 対応する名前付きインポートの使用を求めるエラーが発生します。
* **バージョン 2.1.0**: デフォルトインポートの使用が完全に削除されます。

### ExperimentalWasmDsl アノテーションの新しい場所

以前は、WebAssembly (Wasm) 機能用の `@ExperimentalWasmDsl` アノテーションは、Kotlin Gradle プラグイン内の以下の場所にありました。

```Kotlin
org.jetbrains.kotlin.gradle.targets.js.dsl.ExperimentalWasmDsl
```

2.0.20 では、`@ExperimentalWasmDsl` アノテーションは以下に移動しました。

```Kotlin
org.jetbrains.kotlin.gradle.ExperimentalWasmDsl
```

以前の場所は非推奨となり、未解決の参照によりビルドに失敗する可能性があります。

`@ExperimentalWasmDsl` アノテーションの新しい場所を反映させるために、Gradle ビルドスクリプトのインポートステートメントを更新してください。新しい `@ExperimentalWasmDsl` の場所に対して明示的なインポートを使用します。

```kotlin
import org.jetbrains.kotlin.gradle.ExperimentalWasmDsl
```

あるいは、古いパッケージからのスターインポートステートメントを削除してください。

```kotlin
import org.jetbrains.kotlin.gradle.targets.js.dsl.*
```

## Kotlin/JS

Kotlin/JS では、JavaScript での静的メンバーのサポートや JavaScript からの Kotlin コレクションの作成をサポートするための、いくつかの実験的な機能が導入されています。

### JavaScript での Kotlin 静的メンバーの使用サポート

> この機能は [Experimental (実験的)](components-stability.md#stability-levels-explained) です。いつでも削除または変更される可能性があります。
> 評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issue/KT-18891/JS-provide-a-way-to-declare-static-members-JsStatic) でのフィードバックをお待ちしております。
>
{style="warning"}

Kotlin 2.0.20 以降、`@JsStatic` アノテーションを使用できるようになりました。これは [@JvmStatic](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-static/) と同様に機能し、コンパイラに対してターゲットの宣言に対応する追加の静的メソッドを生成するよう指示します。これにより、Kotlin コードの静的メンバーを JavaScript から直接使用できるようになります。

`@JsStatic` アノテーションは、名前付きオブジェクト内で定義された関数や、クラスやインターフェース内で宣言されたコンパニオンオブジェクト内の関数に使用できます。コンパイラは、オブジェクトの静的メソッドと、オブジェクト自体のインスタンスメソッドの両方を生成します。例えば：

```kotlin
class C {
    companion object {
        @JsStatic
        fun callStatic() {}
        fun callNonStatic() {}
    }
}
```

これで、JavaScript において `callStatic()` は静的になりますが、`callNonStatic()` は静的になりません。

```javascript
C.callStatic();              // 動作する、静的関数にアクセス
C.callNonStatic();           // エラー、生成された JavaScript では静的関数ではない
C.Companion.callStatic();    // インスタンスメソッドは残る
C.Companion.callNonStatic(); // 唯一の動作方法
```

また、オブジェクトやコンパニオンオブジェクトのプロパティに `@JsStatic` アノテーションを適用することも可能です。これにより、その getter と setter メソッドが、そのオブジェクトやコンパニオンオブジェクトを含むクラスの静的メンバーになります。

### JavaScript から Kotlin コレクションを作成する機能

> この機能は [Experimental (実験的)](components-stability.md#stability-levels-explained) です。いつでも削除または変更される可能性があります。
> 評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issue/KT-69133/Kotlin-JS-Add-support-for-collection-instantiation-in-JavaScript) でのフィードバックをお待ちしております。
>
{style="warning"}

Kotlin 2.0.0 では、Kotlin コレクションを JavaScript（および TypeScript）にエクスポートする機能が導入されました。今回、JetBrains チームはコレクションの相互運用性を向上させるためのさらなる一歩を踏み出しました。Kotlin 2.0.20 以降、JavaScript/TypeScript 側から直接 Kotlin コレクションを作成できるようになりました。

JavaScript から Kotlin コレクションを作成し、エクスポートされたコンストラクタや関数に引数として渡すことができます。エクスポートされた宣言の中でコレクションに言及すると、Kotlin はそのコレクション用のファクトリを生成し、それが JavaScript/TypeScript で利用可能になります。

以下のエクスポートされた関数を見てください。

```kotlin
// Kotlin
@JsExport
fun consumeMutableMap(map: MutableMap<String, Int>)
```

`MutableMap` コレクションが言及されているため、Kotlin は JavaScript/TypeScript から利用可能なファクトリメソッドを持つオブジェクトを生成します。このファクトリメソッドは、JavaScript の `Map` から `MutableMap` を作成します。

```javascript
// JavaScript
import { consumeMutableMap } from "an-awesome-kotlin-module"
import { KtMutableMap } from "an-awesome-kotlin-module/kotlin-kotlin-stdlib"

consumeMutableMap(
    KtMutableMap.fromJsMap(new Map([["First", 1], ["Second", 2]]))
)
```

この機能は、`Set`、`Map`、`List` の Kotlin コレクション型と、それらの Mutable（可変）な対応物で利用可能です。

## Gradle

Kotlin 2.0.20 は、Gradle 6.8.3 から 8.6 までと完全に互換性があります。Gradle 8.7 および 8.8 もサポートされていますが、1 つだけ例外があります。Kotlin Multiplatform Gradle プラグインを使用している場合、JVM ターゲットで `withJava()` 関数を呼び出しているマルチプラットフォームプロジェクトで非推奨警告が表示されることがあります。この問題については、できるだけ早く修正する予定です。

詳細については、[YouTrack のイシュー](https://youtrack.jetbrains.com/issue/KT-66542/Gradle-JVM-target-with-withJava-produces-a-deprecation-warning)を参照してください。

最新の Gradle リリースまでのバージョンも使用できますが、その場合は非推奨警告が発生したり、新しい Gradle 機能の一部が動作しなかったりする可能性があることに注意してください。

このバージョンでは、JVM ヒストリファイルに基づく古いインクリメンタルコンパイルアプローチの非推奨化プロセスの開始や、プロジェクト間で JVM アーティファクトを共有する新しい方法などの変更が行われています。

### JVM ヒストリファイルに基づくインクリメンタルコンパイルの非推奨化

Kotlin 2.0.20 では、JVM ヒストリファイルに基づくインクリメンタルコンパイルアプローチが、Kotlin 1.8.20 以降デフォルトで有効になっている新しいインクリメンタルコンパイルアプローチに代わって非推奨となりました。

JVM ヒストリファイルに基づくインクリメンタルコンパイルアプローチには、[Gradle のビルドキャッシュ](https://docs.gradle.org/current/userguide/build_cache.html)と連携できない、コンパイル回避 (compilation avoidance) をサポートしていないなどの制限がありました。
対照的に、新しいインクリメンタルコンパイルアプローチはこれらの制限を克服しており、導入以来良好に機能しています。

新しいインクリメンタルコンパイルアプローチが過去 2 回の Kotlin のメジャーリリースでデフォルトで使用されていることを踏まえ、Kotlin 2.0.20 では `kotlin.incremental.useClasspathSnapshot` Gradle プロパティが非推奨となりました。
そのため、これを使用してオプトアウトしている場合は、非推奨警告が表示されます。

### プロジェクト間で JVM アーティファクトをクラスファイルとして共有するオプション

> この機能は [Experimental (実験的)](components-stability.md#stability-levels-explained) です。
> いつでも削除または変更される可能性があります。評価目的でのみ使用してください。
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-61861/Gradle-Kotlin-compilations-depend-on-packed-artifacts) でのフィードバックをお待ちしております。
> オプトインが必要です（詳細は以下を参照）。
>
{style="warning"}

Kotlin 2.0.20 では、JAR ファイルなどの Kotlin/JVM コンパイルの出力がプロジェクト間で共有される方法を変更する、新しいアプローチを導入しました。このアプローチでは、Gradle の `apiElements` 構成に、コンパイルされた `.class` ファイルを含むディレクトリへのアクセスを提供するセカンダリバリアントが追加されます。設定されると、プロジェクトはコンパイル中に圧縮された JAR アーティファクトを要求する代わりに、このディレクトリを使用します。これにより、特にインクリメンタルビルドにおいて、JAR ファイルが圧縮・解凍される回数が削減されます。

私たちのテストでは、この新しいアプローチにより Linux および macOS ホストでビルドパフォーマンスの向上が得られることが示されています。
しかし、Windows ホストでは、ファイルを扱う際の Windows の I/O 処理方法の影響により、パフォーマンスの低下が見られました。

この新しいアプローチを試すには、`gradle.properties` ファイルに以下のプロパティを追加してください。

```none
kotlin.jvm.addClassesVariant=true
```

デフォルトでは、このプロパティは `false` に設定されており、Gradle の `apiElements` バリアントは圧縮された JAR アーティファクトを要求します。

> Gradle には、Java のみのプロジェクトで使用できる関連プロパティがあり、コンパイル中にコンパイル済み `.class` ファイルを含むディレクトリの**代わりに**、圧縮された JAR アーティファクトのみを公開するように設定できます。
>
> ```none
> org.gradle.java.compile-classpath-packaging=true
> ```
>
> このプロパティとその目的の詳細については、Gradle のドキュメントの [Significant build performance drop on Windows for huge multi-projects](https://docs.gradle.org/current/userguide/java_library_plugin.html#sub:java_library_known_issues_windows_performance) を参照してください。
>
{style="note"}

この新しいアプローチに関するフィードバックをお待ちしております。使用中にパフォーマンスの向上に気づきましたか？
[YouTrack](https://youtrack.jetbrains.com/issue/KT-61861/Gradle-Kotlin-compilations-depend-on-packed-artifacts) にコメントを追加してお知らせください。

### Kotlin Gradle プラグインと java-test-fixtures プラグインの依存関係の挙動を調整

Kotlin 2.0.20 より前は、プロジェクトで [`java-test-fixtures` プラグイン](https://docs.gradle.org/current/userguide/java_testing.html#sec:java_test_fixtures) を使用していた場合、依存関係がどのように伝播されるかについて Gradle と Kotlin Gradle プラグインの間で違いがありました。

Kotlin Gradle プラグインは以下の依存関係を伝播していました。

* `java-test-fixtures` プラグインの `implementation` および `api` 依存関係タイプから、`test` ソースセットのコンパイルクラスパスへ。
* メインソースセットの `implementation` および `api` 依存関係タイプから、`java-test-fixtures` プラグインのソースセットのコンパイルクラスパスへ。

しかし、Gradle は `api` 依存関係タイプのみを伝播していました。

この挙動の違いにより、一部のプロジェクトではクラスパス内でリソースファイルが複数回見つかるという問題が発生していました。

Kotlin 2.0.20 以降、Kotlin Gradle プラグインの挙動は Gradle の `java-test-fixtures` プラグインに合わせて調整されたため、この問題や他の Gradle プラグインでこの問題が発生することはなくなりました。

この変更の結果、`test` および `testFixtures` ソースセット内の一部の依存関係にアクセスできなくなる可能性があります。
その場合は、依存関係の宣言タイプを `implementation` から `api` に変更するか、影響を受けるソースセットに新しい依存関係宣言を追加してください。

### コンパイルタスクにアーティファクトへのタスク依存関係が欠落している稀なケースのためのタスク依存関係の追加

2.0.20 より前において、コンパイルタスクがそのアーティファクト入力の 1 つに対してタスク依存関係を欠いているシナリオがあることが判明しました。これは、アーティファクトが時間内に生成されることもあれば、生成されないこともあるため、依存するコンパイルタスクの結果が不安定であることを意味していました。

この問題を修正するために、Kotlin Gradle プラグインは、これらのシナリオにおいて必要なタスク依存関係を自動的に追加するようになりました。

非常に稀なケースですが、この新しい挙動が循環依存エラー（circular dependency error）を引き起こす可能性があることが分かりました。
例えば、一方のコンパイルがもう一方のすべての内部宣言を見ることができ、生成されたアーティファクトが両方のコンパイルタスクの出力に依存している複数のコンパイルがある場合、以下のようなエラーが表示される可能性があります。

```none
FAILURE: Build failed with an exception.

What went wrong:
Circular dependency between the following tasks:
:lib:compileKotlinJvm
--- :lib:jvmJar
     \--- :lib:compileKotlinJvm (*)
(*) - details omitted (listed previously)
```

この循環依存エラーを修正するために、Gradle プロパティ `archivesTaskOutputAsFriendModule` を追加しました。

デフォルトでは、このプロパティはタスク依存関係を追跡するために `true` に設定されています。コンパイルタスクでのアーティファクトの使用を無効にし、タスク依存関係を不要にするには、`gradle.properties` ファイルに以下を追加してください。

```kotlin
kotlin.build.archivesTaskOutputAsFriendModule=false
```

詳細については、[YouTrack のイシュー](https://youtrack.jetbrains.com/issue/KT-69330)を参照してください。

## Compose コンパイラ

Kotlin 2.0.20 では、Compose コンパイラにいくつかの改善が行われました。

### 2.0.0 で導入された不要な再コンポジション問題の修正

Compose コンパイラ 2.0.0 には、非 JVM ターゲットを持つマルチプラットフォームプロジェクトにおいて、型の安定性を誤って推論する場合があるという問題があります。これにより、不要な（あるいは無限の）再コンポジション（recompositions）が発生する可能性があります。Kotlin 2.0.0 用に作成された Compose アプリは、バージョン 2.0.10 以降に更新することを強くお勧めします。

アプリが Compose コンパイラ 2.0.10 以降でビルドされていても、バージョン 2.0.0 でビルドされた依存関係を使用している場合、それらの古い依存関係が依然として再コンポジションの問題を引き起こす可能性があります。
これを防ぐには、依存関係をアプリと同じ Compose コンパイラでビルドされたバージョンに更新してください。

### コンパイラオプションの新しい設定方法

トップレベルパラメータの頻繁な変更を避けるために、新しいオプション設定メカニズムを導入しました。
Compose コンパイラチームにとって、`composeCompiler {}` ブロックにトップレベルのエントリを作成したり削除したりしてテストを行うのは困難です。
そのため、強力なスキップモード (strong skipping mode) や非スキップグループの最適化 (non-skipping group optimizations) などのオプションは、今回から `featureFlags` プロパティを通じて有効化されるようになります。
このプロパティは、最終的にデフォルトになる予定の新しい Compose コンパイラオプションをテストするために使用されます。

この変更は、Compose コンパイラ Gradle プラグインにも適用されました。今後の機能フラグの設定には、以下の構文を使用してください（このコードはすべてのデフォルト値を反転させます）。

```kotlin
composeCompiler {
    featureFlags = setOf(
        ComposeFeatureFlag.IntrinsicRemember.disabled(),
        ComposeFeatureFlag.OptimizeNonSkippingGroups,
        ComposeFeatureFlag.StrongSkipping.disabled()
    )
}
```

Compose コンパイラを直接設定している場合は、以下の構文を使用してください。

```text
-P plugin:androidx.compose.compiler.plugins.kotlin:featureFlag=IntrinsicRemember
```

これに伴い、`enableIntrinsicRemember`、`enableNonSkippingGroupOptimization`、および `enableStrongSkippingMode` プロパティは非推奨となりました。

この新しいアプローチに関するフィードバックについては、[YouTrack](https://youtrack.jetbrains.com/issue/KT-68651/Compose-provide-a-single-place-in-extension-to-configure-all-compose-flags) でお待ちしております。

### 強力なスキップモードがデフォルトで有効に

Compose コンパイラの強力なスキップモード (Strong skipping mode) がデフォルトで有効になりました。

強力なスキップモードは、どのコンポーザブルをスキップできるかのルールを変更する Compose コンパイラの設定オプションです。強力なスキップモードを有効にすると、不安定なパラメータを持つコンポーザブルもスキップできるようになります。
また、強力なスキップモードはコンポーザブル関数内で使用されるラムダを自動的に `remember` するため、再コンポジションを避けるためにラムダを `remember` でラップする必要がなくなります。

詳細については、[強力なスキップモードのドキュメント](https://developer.android.com/develop/ui/compose/performance/stability/strongskipping)を参照してください。

### コンポジション・トレース・マーカーがデフォルトで有効に

コンパイラプラグインのデフォルト値に合わせるため、Compose コンパイラ Gradle プラグインで `includeTraceMarkers` オプションがデフォルトで `true` に設定されました。これにより、Android Studio のシステムトレースプロファイラでコンポーザブル関数を確認できるようになります。コンポジショントレーシングの詳細は、この [Android Developers のブログ記事](https://medium.com/androiddevelopers/jetpack-compose-composition-tracing-9ec2b3aea535)を参照してください。

### 非スキップグループの最適化

このリリースには、新しいコンパイラオプションが含まれています。これを有効にすると、スキップ不可および再実行不可のコンポーザブル関数は、コンポーザブルのボディの周囲にグループを生成しなくなります。これにより割り当てが減少し、パフォーマンスが向上します。
このオプションは実験的でデフォルトでは無効になっていますが、[上記](#new-way-to-configure-compiler-options)に示すように機能フラグ `OptimizeNonSkippingGroups` で有効にできます。

この機能フラグは、より広範なテストの準備が整いました。この機能を有効にした際に見つかった問題は、[Google のイシュートラッカー](https://goo.gle/compose-feedback)に報告してください。

### 抽象コンポーザブル関数でのデフォルトパラメータのサポート

抽象コンポーザブル関数にデフォルトパラメータを追加できるようになりました。

以前は、これが有効な Kotlin コードであっても、Compose コンパイラはこれを試みるとエラーを報告していました。
今回、Compose コンパイラでこれをサポートし、制限が削除されました。これは特に、デフォルトの `Modifier` 値を含めるのに便利です。

```kotlin
abstract class Composables {
    @Composable
    abstract fun Composable(modifier: Modifier = Modifier)
}
```

open なコンポーザブル関数のデフォルトパラメータについては、2.0.20 でも引き続き制限されています。この制限は将来のリリースで対処される予定です。

## 標準ライブラリ (Standard library)

標準ライブラリは、実験的機能として UUID（Universally Unique Identifier）をサポートするようになり、Base64 デコードに関するいくつかの変更が含まれています。

### 共通の Kotlin 標準ライブラリにおける UUID のサポート

> この機能は [Experimental (実験的)](components-stability.md#stability-levels-explained) です。
> オプトインするには、`@ExperimentalUuidApi` アノテーションを使用するか、コンパイラオプション `-opt-in=kotlin.uuid.ExperimentalUuidApi` を使用してください。
>
{style="warning"}

Kotlin 2.0.20 では、アイテムを一意に識別するという課題に対処するため、共通の Kotlin 標準ライブラリに [UUID (universally unique identifiers)](https://en.wikipedia.org/wiki/Universally_unique_identifier) を表すクラスを導入しました。

さらに、この機能は以下の UUID 関連操作のための API も提供します。

* UUID の生成
* 文字列表現からの UUID のパースおよび文字列へのフォーマット
* 指定された 128 ビット値からの UUID の作成
* UUID の 128 ビットへのアクセス

以下のコード例は、これらの操作を示しています。

```kotlin
// UUID 作成用のバイト配列を構築
val byteArray = byteArrayOf(
    0x55, 0x0E, 0x84.toByte(), 0x00, 0xE2.toByte(), 0x9B.toByte(), 0x41, 0xD4.toByte(),
    0xA7.toByte(), 0x16, 0x44, 0x66, 0x55, 0x44, 0x00, 0x00
)

val uuid1 = Uuid.fromByteArray(byteArray)
val uuid2 = Uuid.fromULongs(0x550E8400E29B41D4uL, 0xA716446655440000uL)
val uuid3 = Uuid.parse("550e8400-e29b-41d4-a716-446655440000")

println(uuid1)
// 550e8400-e29b-41d4-a716-446655440000
println(uuid1 == uuid2)
// true
println(uuid2 == uuid3)
// true

// UUID のビットにアクセス
val version = uuid1.toLongs { mostSignificantBits, _ ->
    ((mostSignificantBits shr 12) and 0xF).toInt()
}
println(version)
// 4

// ランダムな UUID を生成
val randomUuid = Uuid.random()

println(uuid1 == randomUuid)
// false
```

`java.util.UUID` を使用する API との互換性を維持するために、Kotlin/JVM には `java.util.UUID` と `kotlin.uuid.Uuid` の間を変換するための 2 つの拡張関数 `.toJavaUuid()` と `.toKotlinUuid()` が用意されています。例えば：

```kotlin
val kotlinUuid = Uuid.parseHex("550e8400e29b41d4a716446655440000")
// Kotlin UUID を java.util.UUID に変換
val javaUuid = kotlinUuid.toJavaUuid()

val javaUuid = java.util.UUID.fromString("550e8400-e29b-41d4-a716-446655440000")
// Java UUID を kotlin.uuid.Uuid に変換
val kotlinUuid = javaUuid.toKotlinUuid()
```

この機能と提供される API により、複数のプラットフォーム間でコード共有が可能になり、マルチプラットフォームソフトウェアの開発が簡素化されます。UUID は、一意の識別子を生成することが困難な環境においても理想的です。

UUID を含むユースケースの例には以下があります。

* データベースレコードへの一意な ID の割り当て
* Web セッション識別子の生成
* 一意の識別や追跡を必要とするあらゆるシナリオ

### HexFormat における minLength のサポート

> [`HexFormat`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-hex-format/) クラスとそのプロパティは [Experimental (実験的)](components-stability.md#stability-levels-explained) です。
> オプトインするには、`@OptIn(ExperimentalStdlibApi::class)` アノテーションを使用するか、コンパイラオプション `-opt-in=kotlin.ExperimentalStdlibApi` を使用してください。
>
{style="warning"}

Kotlin 2.0.20 では、[`HexFormat.number`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-hex-format/number.html) を通じてアクセスできる [`NumberHexFormat`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-hex-format/-number-hex-format/) クラスに新しい `minLength` プロパティが追加されました。
このプロパティを使用すると、数値の 16 進数表現における最小桁数を指定でき、必要な長さを満たすためにゼロでパディングすることができます。また、`removeLeadingZeros` プロパティを使用して、先行するゼロをトリミングすることも可能です。

```kotlin
fun main() {
    println(93.toHexString(HexFormat {
        number.minLength = 4
        number.removeLeadingZeros = true
    }))
    // "005d"
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-2-0-20-minlength-hexformat" validate="false"}

`minLength` プロパティはパースには影響しません。ただし、パースの際、余分な先頭の桁がゼロであれば、型の幅よりも多くの桁を持つ 16 進文字列が許可されるようになりました。

### Base64 デコーダの挙動の変更

> [`Base64` クラス](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io.encoding/-base64/) とその関連機能は [Experimental (実験的)](components-stability.md#stability-levels-explained) です。
> オプトインするには、`@OptIn(ExperimentalEncodingApi::class)` アノテーションを使用するか、コンパイラオプション `-opt-in=kotlin.io.encoding.ExperimentalEncodingApi` を使用してください。
>
{style="warning"}

Kotlin 2.0.20 において、Base64 デコーダの挙動に 2 つの変更が導入されました。

* [Base64 デコーダでパディングが必須に](#the-base64-decoder-now-requires-padding)
* [パディング設定のための `withPadding` 関数を追加](#withpadding-function-for-padding-configuration)

#### Base64 デコーダでパディングが必須に

Base64 エンコーダはデフォルトでパディングを追加するようになり、デコーダはパディングを必須とし、デコード時に非ゼロのパッドビットを禁止するようになりました。

#### パディング設定のための withPadding 関数

ユーザーが Base64 のエンコードおよびデコードのパディング挙動を制御できるように、新しい `.withPadding()` 関数が導入されました。

```kotlin
val base64 = Base64.UrlSafe.withPadding(Base64.PaddingOption.ABSENT_OPTIONAL)
```

この関数により、さまざまなパディングオプションを持つ `Base64` インスタンスを作成できます。

| `PaddingOption`    | エンコード時    | デコード時           |
|--------------------|--------------|---------------------|
| `PRESENT`          | パディングを追加  | パディング必須 |
| `ABSENT`           | パディングを省略 | パディング禁止  |
| `PRESENT_OPTIONAL` | パディングを追加  | パディング任意 |
| `ABSENT_OPTIONAL`  | パディングを省略 | パディング任意 |

異なるパディングオプションを持つ `Base64` インスタンスを作成し、それらを使用してデータのエンコードとデコードを行うことができます。

```kotlin
import kotlin.io.encoding.Base64
import kotlin.io.encoding.ExperimentalEncodingApi

@OptIn(ExperimentalEncodingApi::class)
fun main() {
    // エンコードするデータの例
    val data = "fooba".toByteArray()

    // URL-safe アルファベットと PRESENT パディングを持つ Base64 インスタンスを作成
    val base64Present = Base64.UrlSafe.withPadding(Base64.PaddingOption.PRESENT)
    val encodedDataPresent = base64Present.encode(data)
    println("Encoded data with PRESENT padding: $encodedDataPresent")
    // Encoded data with PRESENT padding: Zm9vYmE=

    // URL-safe アルファベットと ABSENT パディングを持つ Base64 インスタンスを作成
    val base64Absent = Base64.UrlSafe.withPadding(Base64.PaddingOption.ABSENT)
    val encodedDataAbsent = base64Absent.encode(data)
    println("Encoded data with ABSENT padding: $encodedDataAbsent")
    // Encoded data with ABSENT padding: Zm9vYmE

    // データをデコードして戻す
    val decodedDataPresent = base64Present.decode(encodedDataPresent)
    println("Decoded data with PRESENT padding: ${String(decodedDataPresent)}")
    // Decoded data with PRESENT padding: fooba

    val decodedDataAbsent = base64Absent.decode(encodedDataAbsent)
    println("Decoded data with ABSENT padding: ${String(decodedDataAbsent)}")
    // Decoded data with ABSENT padding: fooba
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-2-0-20-base64-decoder" validate="false"}

## ドキュメントの更新

Kotlin ドキュメントにいくつかの注目すべき変更が行われました。

* [標準入力のページ](standard-input.md) の改善 - Java の Scanner と `readln()` の使い方について学びましょう。
* [K2 コンパイラへの移行ガイド](k2-compiler-migration-guide.md) の改善 - パフォーマンスの向上、Kotlin ライブラリとの互換性、カスタムコンパイラプラグインの取り扱いについて学びましょう。
* [例外 (Exceptions) ページ](exceptions.md) の改善 - 例外の概要、スローとキャッチの方法について学びましょう。
* [JVM での JUnit を使用したテストコード - チュートリアル](jvm-test-using-junit.md) の改善 - JUnit を使用したテストの作成方法について学びましょう。
* [Swift/Objective-C との相互運用性ページ](native-objc-interop.md) の改善 - Swift/Objective-C コードで Kotlin 宣言を使用する方法、および Kotlin コードで Objective-C 宣言を使用する方法を学びましょう。
* [Swift パッケージのエクスポート設定ページ](https://kotlinlang.org/docs/multiplatform/multiplatform-spm-export.html) の改善 - Swift Package Manager 依存関係として利用可能な Kotlin/Native 出力を設定する方法について学びましょう。

## Kotlin 2.0.20 のインストール

IntelliJ IDEA 2023.3 および Android Studio Iguana (2023.2.1) Canary 15 以降、Kotlin プラグインは IDE に含まれるバンドルプラグインとして配布されています。これは、JetBrains Marketplace からプラグインをインストールできなくなったことを意味します。

新しい Kotlin バージョンにアップデートするには、ビルドスクリプトで [Kotlin バージョンを 2.0.20 に変更](releases.md#update-to-a-new-kotlin-version)してください。