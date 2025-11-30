[//]: # (title: Kotlin 2.1.0の新機能)

_[リリース日: 2024年11月27日](releases.md#release-details)_

Kotlin 2.1.0 がリリースされました！主なハイライトは以下の通りです。

*   **プレビュー版の新しい言語機能**: [when式でのガード条件（when with a subject）](#guard-conditions-in-when-with-a-subject)、
    [非ローカルな`break`と`continue`](#non-local-break-and-continue)、および[複数ドル記号による文字列補間](#multi-dollar-string-interpolation)。
*   **K2コンパイラの更新**: [コンパイラチェックに関する柔軟性の向上](#extra-compiler-checks)と[kapt実装の改善](#improved-k2-kapt-implementation)。
*   **Kotlin Multiplatform**: [Swiftエクスポートの基本サポート](#basic-support-for-swift-export)の導入、
    [コンパイラオプション用の安定版Gradle DSL](#new-gradle-dsl-for-compiler-options-in-multiplatform-projects-promoted-to-stable)など。
*   **Kotlin/Native**: [`iosArm64`のサポート改善](#iosarm64-promoted-to-tier-1)およびその他の更新。
*   **Kotlin/Wasm**: [インクリメンタルコンパイルのサポート](#support-for-incremental-compilation)を含む複数の更新。
*   **Gradleサポート**: [新しいバージョンのGradleおよびAndroid Gradleプラグインとの互換性の改善](#gradle-improvements)、
    および[Kotlin GradleプラグインAPIの更新](#new-api-for-kotlin-gradle-plugin-extensions)。
*   **ドキュメント**: [Kotlinドキュメントの大幅な改善](#documentation-updates)。

## IDEサポート

2.1.0 をサポートする Kotlin プラグインは、最新の IntelliJ IDEA および Android Studio にバンドルされています。
IDE の Kotlin プラグインを更新する必要はありません。
ビルドスクリプトで Kotlin のバージョンを 2.1.0 に変更するだけです。

詳細については、[新しい Kotlin バージョンへの更新](releases.md#update-to-a-new-kotlin-version)を参照してください。

## 言語

K2コンパイラを搭載したKotlin 2.0.0リリース後、JetBrainsチームは新機能で言語の改善に注力しています。
このリリースでは、いくつかの新しい言語設計の改善を発表できることを嬉しく思います。

これらの機能はプレビュー版として利用可能であり、ぜひ試してフィードバックを共有してください。

*   [when式でのガード条件（when with a subject）](#guard-conditions-in-when-with-a-subject)
*   [非ローカルな`break`と`continue`](#non-local-break-and-continue)
*   [複数ドル記号による文字列補間: 文字列リテラル内でのドル記号 (`$`) の処理方法を改善します](#multi-dollar-string-interpolation)。

> すべての機能は、K2 モードが有効になっている IntelliJ IDEA の最新バージョン 2024.3 で IDE サポートが提供されています。
>
> 詳細については、[IntelliJ IDEA 2024.3 のブログ記事](https://blog.jetbrains.com/idea/2024/11/intellij-idea-2024-3/)を参照してください。
>
{style="tip"}

[Kotlin の言語設計機能と提案の全リストを参照](kotlin-language-features-and-proposals.md)。

このリリースでは、以下の言語更新も含まれています。

*   [](#support-for-requiring-opt-in-to-extend-apis)
*   [](#improved-overload-resolution-for-functions-with-generic-types)
*   [](#improved-exhaustiveness-checks-for-when-expressions-with-sealed-classes)

### when式でのガード条件（when with a subject）

> この機能は[プレビュー版](kotlin-evolution-principles.md#pre-stable-features)であり、オプトインが必要です（詳細は下記を参照）。
>
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-71140)でフィードバックをいただけると幸いです。
>
{style="warning"}

2.1.0 から、`when` 式または `when` ステートメントでガード条件を使用できるようになりました。

ガード条件を使用すると、`when` 式のブランチに複数の条件を含めることができ、複雑な制御フローをより明示的かつ簡潔にし、コード構造をフラット化できます。

ブランチにガード条件を含めるには、主要な条件の後に `if` で区切って配置します。

```kotlin
sealed interface Animal {
    data class Cat(val mouseHunter: Boolean) : Animal {
        fun feedCat() {}
    }

    data class Dog(val breed: String) : Animal {
        fun feedDog() {}
    }
}

fun feedAnimal(animal: Animal) {
    when (animal) {
        // Branch with only the primary condition. Calls `feedDog()` when `animal` is `Dog`
        is Animal.Dog -> animal.feedDog()
        // Branch with both primary and guard conditions. Calls `feedCat()` when `animal` is `Cat` and is not `mouseHunter`
        is Animal.Cat if !animal.mouseHunter -> animal.feedCat()
        // Prints "Unknown animal" if none of the above conditions match
        else -> println("Unknown animal")
    }
}
```

1つの `when` 式で、ガード条件があるブランチとないブランチを組み合わせることができます。
ガード条件を持つブランチのコードは、主要な条件とガード条件の両方が `true` の場合にのみ実行されます。
主要な条件が一致しない場合、ガード条件は評価されません。
さらに、ガード条件は `else if` をサポートします。

プロジェクトでガード条件を有効にするには、コマンドラインで以下のコンパイラオプションを使用します。

```bash
kotlinc -Xwhen-guards main.kt
```

または、Gradle ビルドファイルの `compilerOptions {}` ブロックに追加します。

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xwhen-guards")
    }
}
```

### 非ローカルなbreakとcontinue

> この機能は[プレビュー版](kotlin-evolution-principles.md#pre-stable-features)であり、オプトインが必要です（詳細は下記を参照）。
>
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-1436)でフィードバックをいただけると幸いです。
>
{style="warning"}

Kotlin 2.1.0 では、待望の機能である非ローカルな `break` および `continue` を使用できるプレビュー版が追加されました。
この機能により、インライン関数のスコープ内で使用できるツールセットが拡張され、プロジェクト内のボイラープレートコードが削減されます。

以前は、非ローカルな `return` のみを使用できました。
現在、Kotlin は `break` および `continue` [ジャンプ式](returns.md)の非ローカルな使用もサポートしています。
これは、ループを囲むインライン関数に引数として渡されるラムダ内でそれらを適用できることを意味します。

```kotlin
fun processList(elements: List<Int>): Boolean {
    for (element in elements) {
        val variable = element.nullableMethod() ?: run {
            log.warning("Element is null or invalid, continuing...")
            continue
        }
        if (variable == 0) return true // If variable is zero, return true
    }
    return false
}
```

プロジェクトでこの機能を試すには、コマンドラインで `-Xnon-local-break-continue` コンパイラオプションを使用します。

```bash
kotlinc -Xnon-local-break-continue main.kt
```

または、Gradle ビルドファイルの `compilerOptions {}` ブロックに追加します。

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xnon-local-break-continue")
    }
}
```

この機能は、将来の Kotlin リリースで安定版にする予定です。
非ローカルな `break` および `continue` の使用中に問題が発生した場合は、[課題トラッカー](https://youtrack.jetbrains.com/issue/KT-1436)にご報告ください。

### 複数ドル記号による文字列補間

> この機能は[プレビュー版](kotlin-evolution-principles.md#pre-stable-features)であり、オプトインが必要です（詳細は下記を参照）。
>
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-2425)でフィードバックをいただけると幸いです。
>
{style="warning"}

Kotlin 2.1.0 は、複数ドル記号による文字列補間のサポートを導入し、文字列リテラル内でのドル記号 (`$`) の処理方法を改善します。
この機能は、テンプレートエンジン、JSON スキーマ、その他のデータ形式など、複数のドル記号を必要とするコンテキストで役立ちます。

Kotlin の文字列補間では、1つのドル記号を使用します。
しかし、財務データやテンプレートシステムで一般的な文字列リテラルにドル記号を使用する場合、以前は`${'$'}`のような回避策が必要でした。
複数ドル記号による補間機能が有効になると、いくつのドル記号で補間をトリガーするかを設定でき、より少ないドル記号は文字列リテラルとして扱われます。

以下は、`$` を使用してプレースホルダーを持つ JSON スキーマの複数行文字列を生成する例です。

```kotlin
val KClass<*>.jsonSchema : String
    get() = $"""
    {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "$id": "https://example.com/product.schema.json",
      "$dynamicAnchor": "meta"
      "title": "${simpleName ?: qualifiedName ?: "unknown"}",
      "type": "object"
    }
    """
```

この例では、最初の `$` は、補間をトリガーするために **2つのドル記号** (`$$`) が必要であることを意味します。
これにより、`$schema`、`$id`、`$dynamicAnchor` が補間マーカーとして解釈されるのを防ぎます。

このアプローチは、プレースホルダー構文にドル記号を使用するシステムと連携する場合に特に役立ちます。

この機能を有効にするには、コマンドラインで以下のコンパイラオプションを使用します。

```bash
kotlinc -Xmulti-dollar-interpolation main.kt
```

または、Gradle ビルドファイルの `compilerOptions {}` ブロックを更新します。

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xmulti-dollar-interpolation")
    }
}
```

コードが既に単一ドル記号による標準の文字列補間を使用している場合、変更は必要ありません。
文字列リテラルにドル記号が必要な場合はいつでも `$$` を使用できます。

### APIを拡張するためのオプトイン必須化のサポート

Kotlin 2.1.0 では、[`@SubclassOptInRequired`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-subclass-opt-in-required/) アノテーションが導入されました。これにより、ライブラリの作成者は、ユーザーが実験的なインターフェースを実装したり、実験的なクラスを拡張したりする前に、明示的なオプトインを要求できます。

この機能は、ライブラリのAPIが使用するには十分安定しているが、新しい抽象関数によって進化する可能性があり、継承に対して不安定になる場合に役立ちます。

API要素にオプトイン要件を追加するには、アノテーションクラスへの参照と共に `@SubclassOptInRequired` アノテーションを使用します。

```kotlin
@RequiresOptIn(
level = RequiresOptIn.Level.WARNING,
message = "Interfaces in this library are experimental"
)
annotation class UnstableApi()

@SubclassOptInRequired(UnstableApi::class)
interface CoreLibraryApi
```

この例では、`CoreLibraryApi` インターフェースは、ユーザーがそれを実装する前にオプトインすることを要求します。
ユーザーは次のようにオプトインできます。

```kotlin
@OptIn(UnstableApi::class)
interface MyImplementation: CoreLibraryApi
```

> `@SubclassOptInRequired` アノテーションを使用してオプトインを要求する場合、その要件は[インナーまたはネストされたクラス](nested-classes.md)には伝播されません。
>
{style="note"}

APIで `@SubclassOptInRequired` アノテーションを使用する実際の例については、`kotlinx.coroutines` ライブラリの [`SharedFlow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-shared-flow/) インターフェースを確認してください。

### ジェネリック型を持つ関数のオーバーロード解決の改善

以前は、関数に複数のオーバーロードがあり、そのうちのいくつかがジェネリック型の値パラメータを持ち、他が同じ位置に関数型を持つ場合、解決動作が一貫しないことがありました。

これにより、オーバーロードがメンバ関数であるか拡張関数であるかによって、異なる動作が生じました。
例：

```kotlin
class KeyValueStore<K, V> {
    fun store(key: K, value: V) {} // 1
    fun store(key: K, lazyValue: () -> V) {} // 2
}

fun <K, V> KeyValueStore<K, V>.storeExtension(key: K, value: V) {} // 1 
fun <K, V> KeyValueStore<K, V>.storeExtension(key: K, lazyValue: () -> V) {} // 2

fun test(kvs: KeyValueStore<String, Int>) {
    // Member functions
    kvs.store("", 1)    // Resolves to 1
    kvs.store("") { 1 } // Resolves to 2

    // Extension functions
    kvs.storeExtension("", 1)    // Resolves to 1
    kvs.storeExtension("") { 1 } // Doesn't resolve
}
```

この例では、`KeyValueStore` クラスには `store()` 関数の2つのオーバーロードがあり、一方はジェネリック型 `K` と `V` を持つ関数パラメータを持ち、もう一方はジェネリック型 `V` を返すラムダ関数を持っています。
同様に、拡張関数 `storeExtension()` にも2つのオーバーロードがあります。

`store()` 関数がラムダ関数を使用する場合と使用しない場合で呼び出されたとき、コンパイラは正しいオーバーロードを正常に解決しました。
しかし、拡張関数 `storeExtension()` がラムダ関数と共に呼び出された場合、コンパイラは両方のオーバーロードが適用可能であると誤って判断したため、正しいオーバーロードを解決できませんでした。

この問題を解決するため、新しいヒューリスティックを導入しました。これにより、ジェネリック型を持つ関数パラメータが、別の引数からの情報に基づいてラムダ関数を受け入れられない場合、コンパイラは適用候補のオーバーロードを破棄できるようになります。
この変更により、メンバ関数と拡張関数の動作が一貫し、Kotlin 2.1.0 ではデフォルトで有効になっています。

### sealedクラスを持つwhen式の網羅性チェックの改善

以前のバージョンの Kotlin では、`sealed class` 階層内のすべてのケースが網羅されている場合でも、コンパイラは sealed 型の上限を持つ型パラメータに対する `when` 式に `else` ブランチを要求していました。
この動作は Kotlin 2.1.0 で対処・改善され、網羅性チェックがより強力になり、冗長な `else` ブランチを削除できるようになり、`when` 式がよりクリーンで直感的になりました。

変更点を示す例を以下に示します。

```kotlin
sealed class Result
object Error: Result()
class Success(val value: String): Result()

fun <T : Result> render(result: T) = when (result) {
    Error -> "Error!"
    is Success -> result.value
    // Requires no else branch
}
```

## Kotlin K2コンパイラ

Kotlin 2.1.0 では、K2 コンパイラは、[コンパイラチェック](#extra-compiler-checks)や[警告](#global-warning-suppression)を扱う際の[柔軟性を高め](#extra-compiler-checks)、さらに [kapt プラグインのサポート](#improved-k2-kapt-implementation)も改善されました。

### 追加のコンパイラチェック

Kotlin 2.1.0 では、K2 コンパイラで追加のチェックを有効にできるようになりました。
これらは、通常コンパイルには不可欠ではないが、以下のケースを検証したい場合に役立つ追加の宣言、式、および型チェックです。

| チェックタイプ                                            | コメント                                                                                  |
|:------------------------------------------------------|:-----------------------------------------------------------------------------------------|
| `REDUNDANT_NULLABLE`                                  | `Boolean??` が `Boolean?` の代わりに使用されています                                        |
| `PLATFORM_CLASS_MAPPED_TO_KOTLIN`                     | `java.lang.String` が `kotlin.String` の代わりに使用されています                           |
| `ARRAY_EQUALITY_OPERATOR_CAN_BE_REPLACED_WITH_EQUALS` | `arrayOf("") == arrayOf("")` が `arrayOf("").contentEquals(arrayOf(""))` の代わりに使用されています |
| `REDUNDANT_CALL_OF_CONVERSION_METHOD`                 | `42.toInt()` が `42` の代わりに使用されています                                           |
| `USELESS_CALL_ON_NOT_NULL`                            | `"".orEmpty()` が `""` の代わりに使用されています                                         |
| `REDUNDANT_SINGLE_EXPRESSION_STRING_TEMPLATE`         | `"$string"` が `string` の代わりに使用されています                                         |
| `UNUSED_ANONYMOUS_PARAMETER`                          | ラムダ式でパラメータが渡されているが、使用されていません                                     |
| `REDUNDANT_VISIBILITY_MODIFIER`                       | `public class Klass` が `class Klass` の代わりに使用されています                            |
| `REDUNDANT_MODALITY_MODIFIER`                         | `final class Klass` が `class Klass` の代わりに使用されています                             |
| `REDUNDANT_SETTER_PARAMETER_TYPE`                     | `set(value: Int)` が `set(value)` の代わりに使用されています                              |
| `CAN_BE_VAL`                                          | `var local = 0` が定義されているが再割り当てされておらず、代わりに `val local = 42` が使用できます |
| `ASSIGNED_VALUE_IS_NEVER_READ`                        | `val local = 42` が定義されているが、コード内でその後使用されていません                  |
| `UNUSED_VARIABLE`                                     | `val local = 0` が定義されているが、コード内で使用されていません                           |
| `REDUNDANT_RETURN_UNIT_TYPE`                          | `fun foo(): Unit {}` が `fun foo() {}` の代わりに使用されています                          |
| `UNREACHABLE_CODE`                                    | コードステートメントが存在するが、実行されることはありません                                 |

チェックが `true` の場合、問題を修正するための提案を含むコンパイラ警告が表示されます。

追加チェックはデフォルトで無効になっています。
これらを有効にするには、コマンドラインで `-Wextra` コンパイラオプションを使用するか、Gradle ビルドファイルの `compilerOptions {}` ブロックで `extraWarnings` を指定します。

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        extraWarnings.set(true)
    }
}
```

コンパイラオプションの定義と使用方法の詳細については、[Kotlin Gradle プラグインのコンパイラオプション](gradle-compiler-options.md)を参照してください。

### グローバルな警告抑制

2.1.0 では、Kotlin コンパイラは待望の機能である、警告をグローバルに抑制する機能を受け入れました。

コマンドラインで `-Xsuppress-warning=WARNING_NAME` 構文を使用するか、ビルドファイルの `compilerOptions {}` ブロックで `freeCompilerArgs` 属性を使用して、プロジェクト全体の特定の警告を抑制できるようになりました。

たとえば、プロジェクトで[追加のコンパイラチェック](#extra-compiler-checks)が有効になっているが、そのうちの1つを抑制したい場合は、次のように使用します。

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        extraWarnings.set(true)
        freeCompilerArgs.add("-Xsuppress-warning=CAN_BE_VAL")
    }
}
```

警告を抑制したいが、その名前がわからない場合は、要素を選択して電球アイコンをクリックします（または <shortcut>Cmd + Enter</shortcut> / <shortcut>Alt + Enter</shortcut> を使用します）。

![警告名のインテンション](warning-name-intention.png){width=500}

新しいコンパイラオプションは現在[実験的](components-stability.md#stability-levels-explained)です。
以下の詳細も注目に値します。

*   エラーの抑制は許可されていません。
*   不明な警告名を渡すと、コンパイルエラーになります。
*   複数の警告を一度に指定できます。
  
   <tabs>
   <tab title="コマンドライン">

   ```bash
   kotlinc -Xsuppress-warning=NOTHING_TO_INLINE -Xsuppress-warning=NO_TAIL_CALLS_FOUND main.kt
   ```

   </tab>
   <tab title="ビルドファイル">

   ```kotlin
   // build.gradle.kts
   kotlin {
       compilerOptions {
           freeCompilerArgs.addAll(
               listOf(
                   "-Xsuppress-warning=NOTHING_TO_INLINE",
                   "-Xsuppress-warning=NO_TAIL_CALLS_FOUND"
               )
           )
       }
   }
   ```

   </tab>
   </tabs>

### K2 kapt実装の改善

> K2 コンパイラ用 kapt プラグイン (K2 kapt) は[アルファ版](components-stability.md#stability-levels-explained)です。これはいつでも変更される可能性があります。
>
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-71439/K2-kapt-feedback)でフィードバックをいただけると幸いです。
>
{style="warning"}

現在、[kapt](kapt.md) プラグインを使用するプロジェクトは、デフォルトで K1 コンパイラを使用し、Kotlin 1.9 までのバージョンをサポートしています。

Kotlin 1.9.20 では、K2 コンパイラを搭載した kapt プラグイン (K2 kapt) の実験的実装を公開しました。
技術的およびパフォーマンスの問題を軽減するために、K2 kapt の内部実装を改善しました。

新しい K2 kapt 実装は新機能を導入していませんが、以前の K2 kapt 実装と比較してパフォーマンスが大幅に向上しました。
さらに、K2 kapt プラグインの動作は、K1 kapt の動作に非常に近くなりました。

新しい K2 kapt プラグイン実装を使用するには、以前の K2 kapt プラグインと同様に有効にします。
プロジェクトの `gradle.properties` ファイルに以下のオプションを追加します。

```kotlin
kapt.use.k2=true
```

今後のリリースでは、K2 kapt 実装が K1 kapt の代わりにデフォルトで有効になるため、手動で有効にする必要がなくなります。

新しい実装が安定する前に、皆様からの[フィードバック](https://youtrack.jetbrains.com/issue/KT-71439/K2-kapt-feedback)を高く評価いたします。

### 符号なし型と非プリミティブ型間のオーバーロード競合の解決

このリリースでは、以下の例のように、関数が符号なし型と非プリミティブ型に対してオーバーロードされた場合に、以前のバージョンで発生する可能性があったオーバーロード競合の解決に対処します。

#### オーバーロードされた拡張関数

```kotlin
fun Any.doStuff() = "Any"
fun UByte.doStuff() = "UByte"

fun main() {
    val uByte: UByte = UByte.MIN_VALUE
    uByte.doStuff() // Overload resolution ambiguity before Kotlin 2.1.0
}
```

以前のバージョンでは、`uByte.doStuff()` を呼び出すと、`Any` および `UByte` の両方の拡張が適用可能であったため、曖昧さが発生しました。

#### オーバーロードされたトップレベル関数

```kotlin
fun doStuff(value: Any) = "Any"
fun doStuff(value: UByte) = "UByte"

fun main() {
    val uByte: UByte = UByte.MIN_VALUE
    doStuff(uByte) // Overload resolution ambiguity before Kotlin 2.1.0
}
```

同様に、`doStuff(uByte)` の呼び出しも、コンパイラが `Any` バージョンと `UByte` バージョンのどちらを使用するかを決定できなかったため、曖昧でした。
2.1.0 では、コンパイラはこれらのケースを正しく処理し、より具体的な型（この場合は `UByte`）に優先順位を与えることで曖昧さを解決します。

## Kotlin/JVM

バージョン 2.1.0 から、コンパイラは Java 23 バイトコードを含むクラスを生成できるようになりました。

### JSpecifyのnull許容性不一致診断の厳格化

Kotlin 2.1.0 は、`org.jspecify.annotations` からの null 許容性アノテーションの厳格な処理を強制し、Java 相互運用における型安全性を向上させます。

以下の null 許容性アノテーションが影響を受けます。

*   `org.jspecify.annotations.Nullable`
*   `org.jspecify.annotations.NonNull`
*   `org.jspecify.annotations.NullMarked`
*   `org.jspecify.nullness` のレガシーアノテーション (JSpecify 0.2 以前)

Kotlin 2.1.0 から、null 許容性の不一致はデフォルトで警告からエラーに引き上げられます。
これにより、`@NonNull` や `@Nullable` などのアノテーションが型チェック中に強制され、実行時における予期せぬ null 許容性の問題を防止します。

`@NullMarked` アノテーションは、そのスコープ内のすべてのメンバの null 許容性にも影響を与え、アノテーション付き Java コードを扱う際の動作をより予測可能にします。

新しいデフォルトの動作を示す例を以下に示します。

```java
// Java
import org.jspecify.annotations.*;
public class SomeJavaClass {
    @NonNull
    public String foo() { //...
    }

    @Nullable
    public String bar() { //...
    }
}
```

```kotlin
// Kotlin
fun test(sjc: SomeJavaClass) {
    // Accesses a non-null result, which is allowed
    sjc.foo().length

    // Raises an error in the default strict mode because the result is nullable
    // To avoid the error, use ?.length instead
    sjc.bar().length
}
```

これらのアノテーションの診断の厳格度を手動で制御できます。
そのためには、`-Xnullability-annotations` コンパイラオプションを使用してモードを選択します。

*   `ignore`: Null許容性の不一致を無視する。
*   `warning`: Null許容性の不一致について警告を報告する。
*   `strict`: Null許容性の不一致についてエラーを報告する（デフォルトモード）。

詳細については、[Null許容性アノテーション](java-interop.md#nullability-annotations)を参照してください。

## Kotlin Multiplatform

Kotlin 2.1.0 は、[Swift エクスポートの基本サポート](#basic-support-for-swift-export)を導入し、[Kotlin Multiplatform ライブラリの公開](#ability-to-publish-kotlin-libraries-from-any-host)を容易にします。
また、[コンパイラオプション設定用の新しい DSL](#new-gradle-dsl-for-compiler-options-in-multiplatform-projects-promoted-to-stable) を安定させ、[Isolated Projects 機能のプレビュー](#preview-gradle-s-isolated-projects-in-kotlin-multiplatform)を提供する Gradle 周りの改善にも焦点を当てています。

### マルチプラットフォームプロジェクトにおけるコンパイラオプション用Gradle DSLの安定版への昇格

Kotlin 2.0.0 では、[新しい実験的な Gradle DSL](whatsnew20.md#new-gradle-dsl-for-compiler-options-in-multiplatform-projects) を導入し、マルチプラットフォームプロジェクト全体でコンパイラオプションの設定を簡素化しました。
Kotlin 2.1.0 で、この DSL は安定版に昇格しました。

プロジェクト全体の構成には、3つのレイヤーがあります。最も高いのは拡張レベル、次にターゲットレベル、そして最も低いのはコンパイルユニット（通常はコンパイルタスク）です。

![Kotlinコンパイラオプションのレベル](compiler-options-levels.svg){width=700}

異なるレベルと、それらの間でコンパイラオプションをどのように構成できるかについて詳しく知るには、[コンパイラオプション](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html#compiler-options)を参照してください。

### Kotlin MultiplatformにおけるGradleのIsolated Projectsのプレビュー

> この機能は[実験的](components-stability.md#stability-levels-explained)であり、現在 Gradle ではプレアルファ版の状態です。
> Gradle 8.10 でのみ、評価目的でのみ使用してください。この機能は、いつでも廃止または変更される可能性があります。
>
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-57279/Support-Gradle-Project-Isolation-Feature-for-Kotlin-Multiplatform)でフィードバックをいただけると幸いです。
> オプトインが必要です（詳細は下記を参照）。
>
{style="warning"}

Kotlin 2.1.0 では、マルチプラットフォームプロジェクトで Gradle の [Isolated Projects](https://docs.gradle.org/current/userguide/isolated_projects.html) 機能をプレビューできます。

Gradle の Isolated Projects 機能は、個々の Gradle プロジェクトの設定を相互に「分離」することで、ビルドパフォーマンスを向上させます。
各プロジェクトのビルドロジックは、他のプロジェクトの変更可能な状態に直接アクセスすることを制限されており、それらを安全に並行して実行できます。
この機能をサポートするために、Kotlin Gradle プラグインのモデルにいくつかの変更を加えました。このプレビュー期間中の皆様の経験についてお聞かせいただきたいと考えています。

Kotlin Gradle プラグインの新しいモデルを有効にするには、2つの方法があります。

*   オプション1: **Isolated Projectsを有効にせずに互換性をテストする** –
    Isolated Projects 機能を有効にせずに Kotlin Gradle プラグインの新しいモデルとの互換性をチェックするには、プロジェクトの `gradle.properties` ファイルに以下の Gradle プロパティを追加します。

    ```none
    # gradle.properties
    kotlin.kmp.isolated-projects.support=enable
    ```

*   オプション2: **Isolated Projectsを有効にしてテストする** –
    Gradle で Isolated Projects 機能を有効にすると、Kotlin Gradle プラグインが自動的に新しいモデルを使用するように構成されます。
    Isolated Projects 機能を有効にするには、[システムプロパティを設定します](https://docs.gradle.org/current/userguide/isolated_projects.html#how_do_i_use_it)。
    この場合、Kotlin Gradle プラグイン用の Gradle プロパティをプロジェクトに追加する必要はありません。

### Swiftエクスポートの基本サポート

> この機能は現在、開発の初期段階にあります。これはいつでも廃止または変更される可能性があります。
> オプトインが必要です（詳細は下記を参照）。評価目的でのみ使用してください。
> [YouTrack](https://kotl.in/issue)でフィードバックをいただけると幸いです。
>
{style="warning"}

バージョン 2.1.0 は、Kotlin での Swift エクスポートサポートに向けた最初の一歩を踏み出し、Objective-C ヘッダーを使用せずに Kotlin ソースを Swift インターフェースに直接エクスポートできるようになります。
これにより、Apple ターゲット向けのマルチプラットフォーム開発が容易になるはずです。

現在の基本的なサポートには、以下の機能が含まれます。

*   複数の Gradle モジュールを Kotlin から Swift に直接エクスポートする。
*   `moduleName` プロパティを使用してカスタム Swift モジュール名を定義する。
*   `flattenPackage` プロパティを使用してパッケージ構造の折りたたみルールを設定する。

Swift エクスポートを設定するための出発点として、プロジェクトで以下のビルドファイルを使用できます。

```kotlin
// build.gradle.kts 
kotlin {

    iosX64()
    iosArm64()
    iosSimulatorArm64()

    @OptIn(ExperimentalSwiftExportDsl::class)
    swiftExport {
        // Root module name
        moduleName = "Shared"

        // Collapse rule
        // Removes package prefix from generated Swift code
        flattenPackage = "com.example.sandbox"

        // Export external modules
        export(project(":subproject")) {
            // Exported module name
            moduleName = "Subproject"
            // Collapse exported dependency rule
            flattenPackage = "com.subproject.library"
        }
    }
}
```

Swift エクスポートが既に設定されている[公開サンプル](https://github.com/Kotlin/swift-export-sample)をクローンすることもできます。

コンパイラは、必要なすべてのファイル（`swiftmodule` ファイル、静的 `a` ライブラリ、ヘッダーファイル、`modulemap` ファイルを含む）を自動的に生成し、アプリのビルドディレクトリにコピーします。これは Xcode からアクセスできます。

#### Swiftエクスポートを有効にする方法

この機能は現在、開発の初期段階にあることに留意してください。

Swift エクスポートは現在、iOS フレームワークを Xcode プロジェクトに接続するために[直接統合](https://kotlinlang.org/docs/multiplatform/multiplatform-direct-integration.html)を使用するプロジェクトで動作します。
これは、Android Studio または [Web ウィザード](https://kmp.jetbrains.com/)で作成された Kotlin Multiplatform プロジェクトの標準的な構成です。

プロジェクトで Swift エクスポートを試すには：

1.  プロジェクトの `gradle.properties` ファイルに以下の Gradle オプションを追加します。

    ```none
    # gradle.properties
    kotlin.experimental.swift-export.enabled=true
    ```

2.  Xcode でプロジェクト設定を開きます。
3.  **Build Phases** タブで、`embedAndSignAppleFrameworkForXcode` タスクを含む **Run Script** フェーズを見つけます。
4.  実行スクリプトフェーズで、スクリプトを `embedSwiftExportForXcode` タスクを使用するように調整します。

    ```bash
    ./gradlew :<Shared module name>:embedSwiftExportForXcode
    ```

    ![Swiftエクスポートスクリプトを追加](xcode-swift-export-run-script-phase.png){width=700}

#### Swiftエクスポートに関するフィードバック

今後の Kotlin リリースでは、Swift エクスポートのサポートを拡大し、安定化する予定です。
この [YouTrack 課題](https://youtrack.jetbrains.com/issue/KT-64572)にフィードバックをお願いいたします。

### 任意のホストからKotlinライブラリを公開する機能

> この機能は現在[実験的](components-stability.md#stability-levels-explained)です。
> オプトインが必要です（詳細は下記を参照）。評価目的でのみ使用してください。
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-71290)でフィードバックをいただけると幸いです。
>
{style="warning"}

Kotlin コンパイラは、Kotlin ライブラリを公開するために `.klib` アーティファクトを生成します。
以前は、Mac マシンを必要とする Apple プラットフォームターゲットを除き、どのホストからでも必要なアーティファクトを取得できました。
これは、iOS、macOS、tvOS、watchOS ターゲットを対象とする Kotlin Multiplatform プロジェクトに特別な制約を課していました。

Kotlin 2.1.0 はこの制限を解除し、クロスコンパイルのサポートを追加します。
これにより、どのホストからでも `.klib` アーティファクトを生成できるようになり、Kotlin および Kotlin Multiplatform ライブラリの公開プロセスが大幅に簡素化されるはずです。

#### 任意のホストからライブラリを公開する方法

プロジェクトでクロスコンパイルを試すには、`gradle.properties` ファイルに以下のバイナリオプションを追加します。

```none
# gradle.properties
kotlin.native.enableKlibsCrossCompilation=true
```

この機能は現在実験的であり、いくつかの制限があります。Mac マシンは、以下の場合は引き続き必要です。

*   ライブラリに [cinterop の依存関係](native-c-interop.md)がある場合。
*   プロジェクトで [CocoaPods 統合](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html)が設定されている場合。
*   Apple ターゲット向けの[最終バイナリ](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html)をビルドまたはテストする必要がある場合。

#### 任意のホストからライブラリを公開することに関するフィードバック

この機能を安定させ、将来の Kotlin リリースでライブラリの公開をさらに改善する予定です。
課題トラッカー[YouTrack](https://youtrack.jetbrains.com/issue/KT-71290)にフィードバックをお願いいたします。

詳細については、[マルチプラットフォームライブラリの公開](https://kotlinlang.org/docs/multiplatform/multiplatform-publish-lib-setup.html)を参照してください。

### 非圧縮klibのサポート

Kotlin 2.1.0 では、非圧縮 `.klib` ファイルアーティファクトの生成が可能になりました。
これにより、klib を最初に解凍することなく、直接依存関係を設定するオプションが得られます。

この変更は、Kotlin/Wasm、Kotlin/JS、および Kotlin/Native プロジェクトにおけるコンパイル時間とリンク時間を短縮し、パフォーマンスを向上させる可能性もあります。

たとえば、当社のベンチマークでは、1つのリンクタスクと10のコンパイルタスクを持つプロジェクト（9つの簡素化されたプロジェクトに依存する単一のネイティブ実行可能バイナリをビルドするプロジェクト）で、総ビルド時間が約3%向上することが示されています。
ただし、ビルド時間への実際の影響は、サブプロジェクトの数とそのそれぞれのサイズの両方に依存します。

#### プロジェクトの設定方法

デフォルトでは、Kotlin のコンパイルおよびリンクタスクは、新しい非圧縮アーティファクトを使用するように構成されています。

klib の解決のためにカスタムビルドロジックを設定しており、新しい解凍済みアーティファクトを使用したい場合は、Gradle ビルドファイルで klib パッケージ解決の優先するバリアントを明示的に指定する必要があります。

```kotlin
// build.gradle.kts
import org.jetbrains.kotlin.gradle.plugin.attributes.KlibPackaging
// ...
val resolvableConfiguration = configurations.resolvable("resolvable") {

    // For the new non-packed configuration:
    attributes.attribute(KlibPackaging.ATTRIBUTE, project.objects.named(KlibPackaging.NON_PACKED))

    // For the previous packed configuration:
    attributes.attribute(KlibPackaging.ATTRIBUTE, project.objects.named(KlibPackaging.PACKED))
}
```

非圧縮 `.klib` ファイルは、以前圧縮されていたものと同じパスのプロジェクトのビルドディレクトリに生成されます。
一方、圧縮された klib は現在 `build/libs` ディレクトリにあります。

属性が指定されていない場合、圧縮されたバリアントが使用されます。
利用可能な属性とバリアントのリストは、以下のコンソールコマンドで確認できます。

```shell
./gradlew outgoingVariants
```

この機能に関するフィードバックを[YouTrack](https://kotl.in/issue)でいただけると幸いです。

### 古い`android`ターゲットのさらなる非推奨化

Kotlin 2.1.0 では、古い `android` ターゲット名の非推奨警告がエラーに引き上げられました。

現在、Android を対象とする Kotlin Multiplatform プロジェクトでは、`androidTarget` オプションを使用することをお勧めします。
これは、Google からの今後の Android/KMP プラグインのために `android` 名を解放するために必要な一時的な解決策です。

新しいプラグインが利用可能になったら、さらなる移行手順を提供します。
Google からの新しい DSL は、Kotlin Multiplatform の Android ターゲットサポートの推奨オプションとなります。

詳細については、[Kotlin Multiplatform 互換性ガイド](https://kotlinlang.org/docs/multiplatform/multiplatform-compatibility-guide.html#rename-of-android-target-to-androidtarget)を参照してください。

### 同タイプの複数ターゲット宣言のサポート終了

Kotlin 2.1.0 以前は、マルチプラットフォームプロジェクトで同じタイプの複数のターゲットを宣言できました。
しかし、これによりターゲット間の区別が難しくなり、共有ソースセットを効果的にサポートすることが困難になりました。
ほとんどの場合、別々の Gradle プロジェクトを使用するなど、よりシンプルな設定の方がうまく機能します。
詳細なガイダンスと移行方法の例については、Kotlin Multiplatform 互換性ガイドの[複数の類似ターゲットの宣言](https://kotlinlang.org/docs/multiplatform/multiplatform-compatibility-guide.html#declaring-several-similar-targets)を参照してください。

Kotlin 1.9.20 では、マルチプラットフォームプロジェクトで同じタイプの複数のターゲットを宣言した場合に非推奨警告がトリガーされました。
Kotlin 2.1.0 では、この非推奨警告は Kotlin/JS ターゲットを除くすべてのターゲットでエラーとなりました。
Kotlin/JS ターゲットが免除される理由の詳細については、[YouTrack](https://youtrack.jetbrains.com/issue/KT-47038/KJS-MPP-Split-JS-target-into-JsBrowser-and-JsNode)のこの課題を参照してください。

## Kotlin/Native

Kotlin 2.1.0 には、[`iosArm64` ターゲットサポートのアップグレード](#iosarm64-promoted-to-tier-1)、[cinterop キャッシュプロセスの改善](#changes-to-caching-in-cinterop)、およびその他の更新が含まれています。

### iosArm64がTier 1に昇格

[Kotlin Multiplatform](https://kotlinlang.org/docs/multiplatform/get-started.html) 開発にとって重要な `iosArm64` ターゲットが Tier 1 に昇格しました。
これは Kotlin/Native コンパイラで最高レベルのサポートです。

これは、ターゲットがコンパイルおよび実行可能であることを保証するために、CI パイプラインで定期的にテストされることを意味します。
また、ターゲットのコンパイラリリース間でソースおよびバイナリの互換性も提供します。

ターゲットのティアに関する詳細については、[Kotlin/Native ターゲットサポート](native-target-support.md)を参照してください。

### LLVMの11.1.0から16.0.0へのアップデート

Kotlin 2.1.0 では、LLVM をバージョン 11.1.0 から 16.0.0 に更新しました。
新バージョンには、バグ修正とセキュリティ更新が含まれています。
場合によっては、コンパイラの最適化とコンパイル速度の向上も提供されます。

プロジェクトに Linux ターゲットがある場合は、Kotlin/Native コンパイラがすべての Linux ターゲットでデフォルトで `lld` リンカを使用することに注意してください。

この更新によってコードに影響はないはずですが、何か問題が発生した場合は、[課題トラッカー](http://kotl.in/issue)にご報告ください。

### cinteropにおけるキャッシュの変更

Kotlin 2.1.0 では、cinterop キャッシュプロセスに変更を加えます。
[`CacheableTask`](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/CacheableTask.html) アノテーション型はなくなりました。
新しい推奨アプローチは、タスクの結果をキャッシュするために [`cacheIf`](https://docs.gradle.org/current/kotlin-dsl/gradle/org.gradle.api.tasks/-task-outputs/cache-if.html) 出力タイプを使用することです。

これにより、`UP-TO-DATE`
チェックが[`definition file`](native-definition-file.md)で指定されたヘッダーファイルへの変更を検出できなかった問題を解決し、ビルドシステムがコードを再コンパイルすることを防ぎます。

### mimallocメモリ割り当て機能の非推奨化

Kotlin 1.9.0 で新しいメモリ割り当て機能が導入され、Kotlin 1.9.20 でデフォルトで有効になりました。
新しいアロケータは、ガベージコレクションをより効率的にし、Kotlin/Native メモリマネージャのランタイムパフォーマンスを向上させるように設計されています。

新しいメモリ割り当て機能は、以前のデフォルトアロケータである [mimalloc](https://github.com/microsoft/mimalloc) に取って代わりました。
これで、Kotlin/Native コンパイラにおける mimalloc を非推奨にする時期が来ました。

ビルドスクリプトから `-Xallocator=mimalloc` コンパイラオプションを削除できるようになりました。
何か問題が発生した場合は、[課題トラッカー](http://kotl.in/issue)にご報告ください。

Kotlin のメモリ割り当て機能とガベージコレクションの詳細については、[Kotlin/Native メモリ管理](native-memory-manager.md)を参照してください。

## Kotlin/Wasm

Kotlin/Wasm は、[インクリメンタルコンパイルのサポート](#support-for-incremental-compilation)を含む複数の更新を受けました。

### インクリメンタルコンパイルのサポート

以前は、Kotlin コードに変更を加えるたびに、Kotlin/Wasm ツールチェーンはコードベース全体を再コンパイルする必要がありました。

2.1.0 から、Wasm ターゲットでインクリメンタルコンパイルがサポートされるようになりました。
開発タスクでは、コンパイラは前回のコンパイルからの変更に関連するファイルのみを再コンパイルするようになり、コンパイル時間を大幅に短縮します。

この変更により、現在のコンパイル速度は2倍になり、今後のリリースでさらに改善される予定です。

現在の設定では、Wasm ターゲットのインクリメンタルコンパイルはデフォルトで無効になっています。
インクリメンタルコンパイルを有効にするには、プロジェクトの `local.properties` または `gradle.properties` ファイルに以下の行を追加します。

```none
# gradle.properties
kotlin.incremental.wasm=true
```

Kotlin/Wasm のインクリメンタルコンパイルを試して、[フィードバック](https://youtrack.jetbrains.com/issue/KT-72158/Kotlin-Wasm-incremental-compilation-feedback)を共有してください。
皆様の洞察は、この機能をより早く安定させ、デフォルトで有効にするのに役立ちます。

### ブラウザAPIがkotlinx-browserスタンドアロンライブラリに移動

以前は、Web API および関連ターゲットユーティリティの宣言は Kotlin/Wasm 標準ライブラリの一部でした。

このリリースでは、`org.w3c.*`
の宣言が Kotlin/Wasm 標準ライブラリから新しい [kotlinx-browser ライブラリ](https://github.com/kotlin/kotlinx-browser)に移動されました。
このライブラリには、`org.khronos.webgl`、`kotlin.dom`、`kotlinx.browser` などの他の Web 関連パッケージも含まれています。

この分離によりモジュール性が提供され、Kotlin のリリースサイクルとは独立して Web 関連 API の更新が可能になります。
さらに、Kotlin/Wasm 標準ライブラリには、任意の JavaScript 環境で利用可能な宣言のみが含まれるようになりました。

移動されたパッケージからの宣言を使用するには、プロジェクトのビルド構成ファイルに `kotlinx-browser` の依存関係を追加する必要があります。

```kotlin
// build.gradle.kts
val wasmJsMain by getting {
    dependencies {
        implementation("org.jetbrains.kotlinx:kotlinx-browser:0.3")
    }
}
```

### Kotlin/Wasmのデバッグ体験の改善

以前、Web ブラウザで Kotlin/Wasm コードをデバッグする際、デバッグインターフェースで変数値を低レベルで表現されることがあり、アプリケーションの現在の状態を追跡することが困難でした。

![Kotlin/Wasm 旧デバッガー](wasm-old-debugger.png){width=700}

この体験を改善するため、変数ビューにカスタムフォーマッタが追加されました。
この実装は、Firefox や Chromium ベースのブラウザなど、主要なブラウザでサポートされている[カスタムフォーマッタ API](https://firefox-source-docs.mozilla.org/devtools-user/custom_formatters/index.html) を使用しています。

この変更により、変数値をよりユーザーフレンドリーで理解しやすい方法で表示および特定できるようになりました。

![Kotlin/Wasm 改善されたデバッガー](wasm-debugger-improved.png){width=700}

新しいデバッグ体験を試すには：

1.  `wasmJs {}` コンパイラオプションに以下のコンパイラオプションを追加します。

    ```kotlin
    // build.gradle.kts
    kotlin {
        wasmJs {
            // ...
    
            compilerOptions {
                freeCompilerArgs.add("-Xwasm-debugger-custom-formatters")
            }
        }
    }
    ```

2.  ブラウザでカスタムフォーマッタを有効にします。

    *   Chrome DevTools では、**Settings | Preferences | Console** から利用できます。

        ![Chromeでカスタムフォーマッタを有効にする](wasm-custom-formatters-chrome.png){width=700}

    *   Firefox DevTools では、**Settings | Advanced settings** から利用できます。

        ![Firefoxでカスタムフォーマッタを有効にする](wasm-custom-formatters-firefox.png){width=700}

### Kotlin/Wasmバイナリサイズの縮小

プロダクションビルドによって生成される Wasm バイナリのサイズが最大 30% 削減され、パフォーマンスが向上する可能性があります。
これは、`--closed-world`、`--type-ssa`、および `--type-merging` Binaryen オプションが、すべての Kotlin/Wasm プロジェクトで安全に使用できると見なされ、デフォルトで有効になったためです。

### Kotlin/WasmにおけるJavaScript配列の相互運用性改善

Kotlin/Wasm の標準ライブラリは JavaScript 配列用の `JsArray<T>` 型を提供していますが、`JsArray<T>` を Kotlin のネイティブな `Array` または `List` 型に変換する直接的なメソッドはありませんでした。

このギャップは、配列変換のためのカスタム関数を作成する必要があり、Kotlin コードと JavaScript コード間の相互運用性を複雑にしていました。

このリリースでは、`JsArray<T>` を `Array<T>` に自動的に変換し、その逆も行うアダプター関数が導入され、配列操作が簡素化されます。

ジェネリック型間の変換の例を示します: Kotlin の `List<T>` と `Array<T>` から JavaScript の `JsArray<T>` へ。

```kotlin
val list: List<JsString> =
    listOf("Kotlin", "Wasm").map { it.toJsString() }

// Uses .toJsArray() to convert List or Array to JsArray
val jsArray: JsArray<JsString> = list.toJsArray()

// Uses .toArray() and .toList() to convert it back to Kotlin types 
val kotlinArray: Array<JsString> = jsArray.toArray()
val kotlinList: List<JsString> = jsArray.toList()
```

同様のメソッドは、型付き配列を対応する Kotlin の型に変換するためにも利用できます（例: `IntArray` と `Int32Array`）。詳細情報と実装については、[`kotlinx-browser` リポジトリ]( https://github.com/Kotlin/kotlinx-browser/blob/dfbdceed314567983c98f1d66e8c2e10d99c5a55/src/wasmJsMain/kotlin/arrayCopy.kt)を参照してください。

型付き配列間の変換の例を示します: Kotlin の `IntArray` から JavaScript の `Int32Array` へ。

```kotlin
import org.khronos.webgl.*

    // ...

    val intArray: IntArray = intArrayOf(1, 2, 3)
    
    // Uses .toInt32Array() to convert Kotlin IntArray to JavaScript Int32Array
    val jsInt32Array: Int32Array = intArray.toInt32Array()
    
    // Uses toIntArray() to convert JavaScript Int32Array back to Kotlin IntArray
    val kotlinIntArray: IntArray = jsInt32Array.toIntArray()
```

### Kotlin/WasmにおけるJavaScript例外詳細へのアクセスサポート

以前、Kotlin/Wasm で JavaScript 例外が発生した場合、`JsException` 型は、元の JavaScript エラーの詳細を含まない汎用的なメッセージしか提供しませんでした。

Kotlin 2.1.0 から、特定のコンパイラオプションを有効にすることで、`JsException` に元のエラーメッセージとスタックトレースを含めるように設定できるようになりました。
これにより、JavaScript に起因する問題を診断するためのより多くのコンテキストが提供されます。

この動作は `WebAssembly.JSTag` API に依存しており、特定のブラウザでのみ利用可能です。

*   **Chrome**: バージョン 115 以降でサポート
*   **Firefox**: バージョン 129 以降でサポート
*   **Safari**: まだサポートされていません

デフォルトで無効になっているこの機能を有効にするには、`build.gradle.kts` ファイルに以下のコンパイラオプションを追加します。

```kotlin
// build.gradle.kts
kotlin {
    wasmJs {
        compilerOptions {
            freeCompilerArgs.add("-Xwasm-attach-js-exception")
        }
    }
}
```

新しい動作を示す例を以下に示します。

```kotlin
external object JSON {
    fun <T: JsAny> parse(json: String): T
}

fun main() {
    try {
        JSON.parse("an invalid JSON")
    } catch (e: JsException) {
        println("Thrown value is: ${e.thrownValue}")
        // SyntaxError: Unexpected token 'a', "an invalid JSON" is not valid JSON

        println("Message: ${e.message}")
        // Message: Unexpected token 'a', "an invalid JSON" is not valid JSON

        println("Stacktrace:")
        // Stacktrace:

        // Prints the full JavaScript stack trace 
        e.printStackTrace()
    }
}
```

`-Xwasm-attach-js-exception` オプションが有効な場合、`JsException` は JavaScript エラーからの特定の詳細を提供します。
このオプションがない場合、`JsException` は、JavaScript コードの実行中に例外がスローされたことを示す一般的なメッセージのみを含みます。

### デフォルトエクスポートの非推奨化

名前付きエクスポートへの移行の一環として、以前は JavaScript で Kotlin/Wasm エクスポートにデフォルトインポートが使用された場合に、エラーがコンソールに表示されていました。

2.1.0 では、名前付きエクスポートを完全にサポートするために、デフォルトインポートが完全に削除されました。

Kotlin/Wasm ターゲット向けに JavaScript でコーディングする場合、デフォルトインポートの代わりに、対応する名前付きインポートを使用する必要があります。

この変更は、名前付きエクスポートへの移行に向けた非推奨化サイクルの最終段階を示します。

**バージョン 2.0.0:** コンソールに警告メッセージが表示され、デフォルトエクスポートによるエンティティのエクスポートが非推奨であることを説明しました。

**バージョン 2.0.20:** エラーが発生し、対応する名前付きインポートの使用が要求されました。

**バージョン 2.1.0:** デフォルトインポートの使用は完全に削除されました。

### サブプロジェクト固有のNode.js設定

プロジェクトの Node.js 設定は、`rootProject` 用の `NodeJsRootPlugin` クラスのプロパティを定義することで構成できます。
2.1.0 では、新しいクラス `NodeJsPlugin` を使用して、これらの設定を各サブプロジェクトに対して構成できます。
サブプロジェクトに対して特定の Node.js バージョンを設定する方法を示す例を以下に示します。

```kotlin
// build.gradle.kts
project.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin> {
    project.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec>().version = "22.0.0"
}
```

プロジェクト全体で新しいクラスを使用するには、`allprojects {}` ブロックに同じコードを追加します。

```kotlin
// build.gradle.kts
allprojects {
    project.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin> {
        project.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec>().version = "your Node.js version"
    }
}
```

Gradle コンベンションプラグインを使用して、特定のサブプロジェクトセットに設定を適用することもできます。

## Kotlin/JS

### プロパティにおける非識別子文字のサポート

Kotlin/JS では以前、バッククォートで囲まれたスペースを含む[テストメソッド名](coding-conventions.md#names-for-test-methods)を使用することができませんでした。

同様に、ハイフンやスペースなど、Kotlin 識別子で許可されていない文字を含む JavaScript オブジェクトプロパティにアクセスすることはできませんでした。

```kotlin
external interface Headers {
    var accept: String?

    // Invalid Kotlin identifier due to hyphen
    var `content-length`: String?
}

val headers: Headers = TODO("value provided by a JS library")
val accept = headers.accept
// Causes error due to the hyphen in property name
val length = headers.`content-length`
```

この動作は、非識別子文字を使用してそのようなプロパティにアクセスできる JavaScript および TypeScript とは異なりました。

Kotlin 2.1.0 から、この機能はデフォルトで有効になっています。
Kotlin/JS では、バッククォート (``) と `@JsName` アノテーションを使用して、非識別子文字を含む JavaScript プロパティと対話したり、テストメソッドに名前を付けたりできるようになりました。

さらに、`@JsName` および `@JsQualifier` アノテーションを使用して、Kotlin のプロパティ名を JavaScript の同等なものにマッピングできます。

```kotlin
object Bar {
    val `property example`: String = "bar"
}

@JsQualifier("fooNamespace")
external object Foo {
    val `property example`: String
}

@JsExport
object Baz {
    val `property example`: String = "bar"
}

fun main() {
    // In JavaScript, this is compiled into Bar.property_example_HASH
    println(Bar.`property example`)
    // In JavaScript, this is compiled into fooNamespace["property example"]
    println(Foo.`property example`)
    // In JavaScript, this is compiled into Baz["property example"]
    println(Baz.`property example`)
}
```

### ES2015アロー関数の生成サポート

Kotlin 2.1.0 では、Kotlin/JS は、匿名関数の代わりに `(a, b) => expression` のような ES2015 アロー関数を生成するサポートを導入しました。

アロー関数を使用すると、特に実験的な `-Xir-generate-inline-anonymous-functions` モードを使用している場合に、プロジェクトのバンドルサイズを削減できます。
これにより、生成されるコードも最新の JS とより一致するようになります。

この機能は、ES2015 をターゲットとする場合にデフォルトで有効になります。
または、`-Xes-arrow-functions` コマンドライン引数を使用することで有効にできます。

[公式ドキュメントで ES2015 (ECMAScript 2015, ES6)](https://262.ecma-international.org/6.0/)について詳しく学びましょう。

## Gradleの改善

Kotlin 2.1.0 は Gradle 7.6.3 から 8.6 までと完全に互換性があります。
Gradle バージョン 8.7 から 8.10 もサポートされていますが、1つの例外があります。
Kotlin Multiplatform Gradle プラグインを使用している場合、JVM ターゲットで `withJava()` 関数を呼び出すマルチプラットフォームプロジェクトで非推奨警告が表示される可能性があります。
この問題はできるだけ早く修正する予定です。

詳細については、[YouTrack](https://youtrack.jetbrains.com/issue/KT-66542)の関連課題を参照してください。

最新の Gradle リリースまでの Gradle バージョンも使用できますが、その場合は非推奨警告が表示されたり、新しい Gradle 機能の一部が動作しない可能性があることに留意してください。

### 最小サポートAGPバージョンが7.3.1に引き上げ

Kotlin 2.1.0 から、サポートされる Android Gradle プラグインの最小バージョンは 7.3.1 となります。

### 最小サポートGradleバージョンが7.6.3に引き上げ

Kotlin 2.1.0 から、サポートされる Gradle の最小バージョンは 7.6.3 となります。

### Kotlin Gradleプラグイン拡張の新API

Kotlin 2.1.0 では、Kotlin Gradle プラグインを設定するための独自のプラグインをより簡単に作成できる新しい API が導入されました。
この変更により、`KotlinTopLevelExtension` および `KotlinTopLevelExtensionConfig`
インターフェースが非推奨となり、プラグイン作成者向けに以下のインターフェースが導入されます。

| 名前                     | 説明                                                                                                                                                                                                                                                          |
|:-----------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `KotlinBaseExtension`    | プロジェクト全体の共通 Kotlin JVM、Android、および Multiplatform プラグインオプションを設定するためのプラグイン DSL 拡張型。<list><li>`org.jetbrains.kotlin.jvm`</li><li>`org.jetbrains.kotlin.android`</li><li>`org.jetbrains.kotlin.multiplatform`</li></list> |
| `KotlinJvmExtension`     | プロジェクト全体の Kotlin **JVM** プラグインオプションを設定するためのプラグイン DSL 拡張型。                                                                                                                                                                    |
| `KotlinAndroidExtension` | プロジェクト全体の Kotlin **Android** プラグインオプションを設定するためのプラグイン DSL 拡張型。                                                                                                                                                                |

たとえば、JVM と Android の両方のプロジェクトでコンパイラオプションを設定したい場合は、`KotlinBaseExtension` を使用します。

```kotlin
configure<KotlinBaseExtension> {
    if (this is HasConfigurableKotlinCompilerOptions<*>) {
        with(compilerOptions) {
            if (this is KotlinJvmCompilerOptions) {
                jvmTarget.set(JvmTarget.JVM_17)
            }
        }
    }
}
```

これにより、JVM と Android の両方のプロジェクトで JVM ターゲットが 17 に設定されます。

JVM プロジェクトに特化してコンパイラオプションを設定するには、`KotlinJvmExtension` を使用します。

```kotlin
configure<KotlinJvmExtension> {
    compilerOptions {
        jvmTarget.set(JvmTarget.JVM_17)
    }

    target.mavenPublication {
        groupId = "com.example"
        artifactId = "example-project"
        version = "1.0-SNAPSHOT"
    }
}
```

この例も同様に、JVM プロジェクトの JVM ターゲットを 17 に設定します。
また、プロジェクトの Maven 公開を設定し、その出力が Maven リポジトリに公開されるようにします。

`KotlinAndroidExtension` も全く同様に使用できます。

### Kotlin GradleプラグインAPIからコンパイラシンボルを隠蔽

以前、KGP (Kotlin Gradle Plugin) は `org.jetbrains.kotlin:kotlin-compiler-embeddable` をランタイム依存関係に含んでおり、これにより内部コンパイラシンボルがビルドスクリプトのクラスパスで利用可能になっていました。
これらのシンボルは内部使用のみを目的としていました。

Kotlin 2.1.0 から、KGP は `org.jetbrains.kotlin:kotlin-compiler-embeddable` のクラスファイルのサブセットを JAR ファイルにバンドルし、徐々にそれらを削除していきます。
この変更は、互換性の問題を防止し、KGP のメンテナンスを簡素化することを目的としています。

もし、`kotlinter` のようなプラグインなど、ビルドロジックの他の部分が KGP にバンドルされているものとは異なるバージョンの `org.jetbrains.kotlin:kotlin-compiler-embeddable` に依存している場合、衝突やランタイム例外を引き起こす可能性があります。

このような問題を防止するため、KGP は現在、KGP と共に `org.jetbrains.kotlin:kotlin-compiler-embeddable` がビルドクラスパスに存在する場合に警告を表示します。

長期的な解決策として、`org.jetbrains.kotlin:kotlin-compiler-embeddable` クラスを使用するプラグイン作成者である場合、それらを隔離されたクラスローダーで実行することをお勧めします。
たとえば、[Gradle Workers API](https://docs.gradle.org/current/userguide/worker_api.html) をクラスローダーまたはプロセス分離で使用することで実現できます。

#### Gradle Workers APIの使用

この例は、Gradle プラグインを生成するプロジェクトで Kotlin コンパイラを安全に使用する方法を示しています。
まず、ビルドスクリプトにコンパイルのみの依存関係を追加します。
これにより、シンボルはコンパイル時のみ利用可能になります。

```kotlin
// build.gradle.kts
dependencies {
    compileOnly("org.jetbrains.kotlin:kotlin-compiler-embeddable:%kotlinVersion%")
}
```

次に、Kotlin コンパイラのバージョンを出力する Gradle 作業アクションを定義します。

```kotlin
import org.gradle.workers.WorkAction
import org.gradle.workers.WorkParameters
import org.jetbrains.kotlin.config.KotlinCompilerVersion
abstract class ActionUsingKotlinCompiler : WorkAction<WorkParameters.None> {
    override fun execute() {
        println("Kotlin compiler version: ${KotlinCompilerVersion.getVersion()}")
    }
}
```

次に、クラスローダー分離を使用してこのアクションをワーカーエグゼキュータに送信するタスクを作成します。

```kotlin
import org.gradle.api.DefaultTask
import org.gradle.api.file.ConfigurableFileCollection
import org.gradle.api.tasks.Classpath
import org.gradle.api.tasks.TaskAction
import org.gradle.workers.WorkerExecutor
import javax.inject.Inject
abstract class TaskUsingKotlinCompiler: DefaultTask() {
    @get:Inject
    abstract val executor: WorkerExecutor

    @get:Classpath
    abstract val kotlinCompiler: ConfigurableFileCollection

    @TaskAction
    fun compile() {
        val workQueue = executor.classLoaderIsolation {
            classpath.from(kotlinCompiler)
        }
        workQueue.submit(ActionUsingKotlinCompiler::class.java) {}
    }
}
```

最後に、Gradle プラグインで Kotlin コンパイラのクラスパスを構成します。

```kotlin
import org.gradle.api.Plugin
import org.gradle.api.Project
abstract class MyPlugin: Plugin<Project> {
    override fun apply(target: Project) {
        val myDependencyScope = target.configurations.create("myDependencyScope")
        target.dependencies.add(myDependencyScope.name, "$KOTLIN_COMPILER_EMBEDDABLE:$KOTLIN_COMPILER_VERSION")
        val myResolvableConfiguration = target.configurations.create("myResolvable") {
            extendsFrom(myDependencyScope)
        }
        target.tasks.register("myTask", TaskUsingKotlinCompiler::class.java) {
            kotlinCompiler.from(myResolvableConfiguration)
        }
    }

    companion object {
        const val KOTLIN_COMPILER_EMBEDDABLE = "org.jetbrains.kotlin:kotlin-compiler-embeddable"
        const val KOTLIN_COMPILER_VERSION = "%kotlinVersion%"
    }
}
```

## Composeコンパイラの更新

### 複数の安定性設定ファイルのサポート

Compose コンパイラは複数の安定性設定ファイルを解釈できますが、以前の Compose Compiler Gradle プラグインの `stabilityConfigurationFile` オプションでは、単一のファイルのみ指定可能でした。
Kotlin 2.1.0 では、この機能が再設計され、単一のモジュールに複数の安定性設定ファイルを使用できるようになりました。

*   `stabilityConfigurationFile` オプションは非推奨になりました。
*   新しいオプション `stabilityConfigurationFiles` があり、型は `ListProperty<RegularFile>` です。

新しいオプションを使用して、複数のファイルを Compose コンパイラに渡す方法は以下の通りです。

```kotlin
// build.gradle.kt
composeCompiler {
    stabilityConfigurationFiles.addAll(
        project.layout.projectDirectory.file("configuration-file1.conf"),
        project.layout.projectDirectory.file("configuration-file2.conf"),
    )
}
```

### 一時停止可能なコンポジション

一時停止可能なコンポジションは、コンパイラがスキップ可能な関数を生成する方法を変更する、新しい実験的な機能です。
この機能を有効にすると、実行時にスキップポイントでコンポジションを中断できるため、長時間実行されるコンポジションプロセスを複数のフレームに分割できます。
一時停止可能なコンポジションは、遅延リストやその他のパフォーマンスを重視するコンポーネントで使用され、ブロッキング方式で実行するとフレーム落ちを引き起こす可能性のあるコンテンツをプリフェッチします。

一時停止可能なコンポジションを試すには、Compose コンパイラの Gradle 設定に以下の機能フラグを追加します。

```kotlin
// build.gradle.kts
composeCompiler {
    featureFlags = setOf(
        ComposeFeatureFlag.PausableComposition
    )
}
```

> この機能のランタイムサポートは、`androidx.compose.runtime` の 1.8.0-alpha02 バージョンで追加されました。
> 古いランタイムバージョンで使用した場合、この機能フラグは効果がありません。
>
{style="note"}

### openおよびオーバーライドされた@Composable関数の変更

仮想（オープン、抽象、およびオーバーライドされた）`@Composable` 関数は、再起動可能ではなくなりました。
再起動可能なグループのコード生成は、継承で[正しく動作しない](https://issuetracker.google.com/329477544)呼び出しを生成し、ランタイムクラッシュを引き起こしていました。

これは、仮想関数が再起動またはスキップされないことを意味します。状態が無効になった場合、ランタイムは代わりにその親コンポーザブルを再コンポジションします。
コードがリコンポジションに影響を受けやすい場合、ランタイムの動作に変化が見られる可能性があります。

### パフォーマンスの改善

Compose コンパイラは以前、`@Composable` 型を変換するためにモジュールの IR の完全なコピーを作成していました。
Compose に関連しない要素をコピーする際のメモリ消費量の増加とは別に、この動作は[特定のケース](https://issuetracker.google.com/365066530)で下流のコンパイラプラグインを破壊することもありました。

このコピー操作は削除され、コンパイル時間が高速化される可能性があります。

## 標準ライブラリ

### 標準ライブラリAPIの非推奨度の変更

Kotlin 2.1.0 では、いくつかの標準ライブラリ API の非推奨度が警告からエラーに引き上げられます。
これらの API にコードが依存している場合、互換性を確保するために更新する必要があります。
最も注目すべき変更は以下の通りです。

*   **`Char`および`String`のロケール依存のケース変換関数が非推奨に:**
    `Char.toLowerCase()`、`Char.toUpperCase()`、`String.toUpperCase()`、
    および `String.toLowerCase()` などの関数が非推奨となり、使用するとエラーになります。
    それらをロケールに依存しない関数の代替または他のケース変換メカニズムに置き換えてください。
    デフォルトロケールを引き続き使用したい場合は、`String.toLowerCase()`
    のような呼び出しを、ロケールを明示的に指定して `String.lowercase(Locale.getDefault())` に置き換えてください。
    ロケールに依存しない変換の場合は、デフォルトで不変ロケールを使用する `String.lowercase()` に置き換えてください。

*   **Kotlin/NativeのフリージングAPIが非推奨に:**
    以前 `@FreezingIsDeprecated` アノテーションでマークされていたフリージング関連の宣言を使用すると、エラーになります。
    この変更は、Kotlin/Native におけるレガシーメモリマネージャからの移行を反映しており、スレッド間でオブジェクトを共有するためにオブジェクトのフリーズが必要でした。
    新しいメモリモデルでフリージング関連 API から移行する方法については、[Kotlin/Native 移行ガイド](native-migration-guide.md#update-your-code)を参照してください。
    詳細については、[フリージング非推奨化に関するお知らせ](whatsnew1720.md#freezing)を参照してください。

*   **`appendln()`が`appendLine()`に代わって非推奨に:**
    `StringBuilder.appendln()` および `Appendable.appendln()` 関数は非推奨となり、使用するとエラーになります。
    それらを置き換えるには、代わりに `StringBuilder.appendLine()` または `Appendable.appendLine()` 関数を使用します。
    `appendln()` 関数が非推奨となるのは、Kotlin/JVM 上で `line.separator` システムプロパティを使用するためで、これは OS ごとに異なるデフォルト値を持っています。
    Kotlin/JVM では、このプロパティは Windows ではデフォルトで `\r
` (CR LF) に、他のシステムでは `
` (LF) になります。
    一方、`appendLine()` 関数は行区切り文字として一貫して `
` (LF) を使用し、プラットフォーム間で一貫した動作を保証します。

このリリースで影響を受ける API の完全なリストについては、[KT-71628](https://youtrack.jetbrains.com/issue/KT-71628) YouTrack 課題を参照してください。

### java.nio.file.Pathの安定版ファイルツリー走査拡張

Kotlin 1.7.20 で、`java.nio.file.Path` クラスの実験的な[拡張関数](extensions.md#extension-functions)が導入され、ファイルツリーを走査できるようになりました。
Kotlin 2.1.0 では、以下のファイルツリー走査拡張が[安定版](components-stability.md#stability-levels-explained)になりました。

*   `walk()` は、指定されたパスをルートとするファイルツリーを遅延的に走査します。
*   `fileVisitor()` を使用すると、`FileVisitor` を個別に作成できます。
    `FileVisitor` は、走査中にディレクトリやファイルに対して実行されるアクションを指定します。
*   `visitFileTree(fileVisitor: FileVisitor, ...)` は、ファイルツリーを走査し、遭遇した各エントリで指定された `FileVisitor` を呼び出します。内部的には `java.nio.file.Files.walkFileTree()` 関数を使用しています。
*   `visitFileTree(..., builderAction: FileVisitorBuilder.() -> Unit)` は、提供された `builderAction` で `FileVisitor` を作成し、`visitFileTree(fileVisitor, ...)` 関数を呼び出します。
*   `sealed interface FileVisitorBuilder` を使用すると、カスタムの `FileVisitor` 実装を定義できます。
*   `enum class PathWalkOption` は、`Path.walk()` 関数の走査オプションを提供します。

以下の例は、これらのファイル走査 API を使用してカスタムの `FileVisitor` 動作を作成し、ファイルやディレクトリを訪れる際の特定のアクションを定義する方法を示します。

例えば、`FileVisitor` を明示的に作成し、後で使用することができます。

```kotlin
val cleanVisitor = fileVisitor {
    onPreVisitDirectory { directory, attributes ->
        // Placeholder: Add logic on visiting directories
        FileVisitResult.CONTINUE
    }

    onVisitFile { file, attributes ->
        // Placeholder: Add logic on visiting files
        FileVisitResult.CONTINUE
    }
}

// Placeholder: Add logic here for general setup before traversal
projectDirectory.visitFileTree(cleanVisitor)
```

また、`builderAction` を使用して `FileVisitor` を作成し、走査のためにすぐに使用することもできます。

```kotlin
projectDirectory.visitFileTree {
    // Defines the builderAction:
    onPreVisitDirectory { directory, attributes ->
        // Some logic on visiting directories
        FileVisitResult.CONTINUE
    }

    onVisitFile { file, attributes ->
        // Some logic on visiting files
        FileVisitResult.CONTINUE
    }
}
```

さらに、`walk()` 関数を使用して、指定されたパスをルートとするファイルツリーを走査することもできます。

```kotlin
fun traverseFileTree() {
    val cleanVisitor = fileVisitor {
        onPreVisitDirectory { directory, _ ->
            if (directory.name == "build") {
                directory.toFile().deleteRecursively()
                FileVisitResult.SKIP_SUBTREE
            } else {
                FileVisitResult.CONTINUE
            }
        }

        // Deletes files with the .class extension
        onVisitFile { file, _ ->
            if (file.extension == "class") {
                file.deleteExisting()
            }
            FileVisitResult.CONTINUE
        }
    }

    // Sets up the root directory and files
    val rootDirectory = createTempDirectory("Project")

    // Creates the src directory with A.kt and A.class files
    rootDirectory.resolve("src").let { srcDirectory ->
        srcDirectory.createDirectory()
        srcDirectory.resolve("A.kt").createFile()
        srcDirectory.resolve("A.class").createFile()
    }

    // Creates the build directory with a Project.jar file
    rootDirectory.resolve("build").let { buildDirectory ->
        buildDirectory.createDirectory()
        buildDirectory.resolve("Project.jar").createFile()
    }

    // Uses the walk() function:
    val directoryStructure = rootDirectory.walk(PathWalkOption.INCLUDE_DIRECTORIES)
        .map { it.relativeTo(rootDirectory).toString() }
        .toList().sorted()
    println(directoryStructure)
    // "[, build, build/Project.jar, src, src/A.class, src/A.kt]"
  
    // Traverses the file tree with cleanVisitor, applying the rootDirectory.visitFileTree(cleanVisitor) cleanup rules
    val directoryStructureAfterClean = rootDirectory.walk(PathWalkOption.INCLUDE_DIRECTORIES)
        .map { it.relativeTo(rootDirectory).toString() }
        .toList().sorted()
    println(directoryStructureAfterClean)
    // "[, src, src/A.kt]"
}
```

## ドキュメントの更新

Kotlin のドキュメントにはいくつかの注目すべき変更が加えられました。

### 言語の概念

*   改善された[Null安全性](null-safety.md)ページ – コード内で `null` 値を安全に処理する方法を学びます。
*   改善された[オブジェクトの宣言と式](object-declarations.md)ページ – クラスを定義し、単一のステップでインスタンスを作成する方法を学びます。
*   改善された[When式とステートメント](control-flow.md#when-expressions-and-statements)セクション – `when` 条件式とその使用方法について学びます。
*   更新された[Kotlinロードマップ](roadmap.md)、[Kotlin進化の原則](kotlin-evolution-principles.md)、および[Kotlin言語機能と提案](kotlin-language-features-and-proposals.md)ページ – Kotlinの計画、進行中の開発、および指導原則について学びます。

### Composeコンパイラ

*   [Composeコンパイラのドキュメント](compose-compiler-migration-guide.md)がコンパイラとプラグインセクションに移動 – Composeコンパイラ、コンパイラオプション、および移行手順について学びます。

### APIリファレンス

*   新しい[Kotlin GradleプラグインAPIリファレンス](https://kotlinlang.org/api/kotlin-gradle-plugin) – Kotlin GradleプラグインとComposeコンパイラGradleプラグインのAPIリファレンスを探索します。

### マルチプラットフォーム開発

*   新しい[マルチプラットフォーム用Kotlinライブラリのビルド](https://kotlinlang.org/docs/api-guidelines-build-for-multiplatform.html)ページ – Kotlin Multiplatform 用に Kotlin ライブラリを設計する方法を学びます。
*   新しい[Kotlin Multiplatformの紹介](https://kotlinlang.org/docs/multiplatform/get-started.html)ページ – Kotlin Multiplatform の主要な概念、依存関係、ライブラリなどについて学びます。
*   更新された[Kotlin Multiplatformの概要](multiplatform.topic)ページ – Kotlin Multiplatform の基本と一般的なユースケースをナビゲートします。
*   新しい[iOS統合](https://kotlinlang.org/docs/multiplatform/multiplatform-ios-integration-overview.html)セクション – Kotlin Multiplatform 共有モジュールを iOS アプリに統合する方法を学びます。
*   新しい[Kotlin/Nativeの定義ファイル](native-definition-file.md)ページ – C および Objective-C ライブラリを使用するための定義ファイルの作成方法を学びます。
*   [WASIを使ってみる](wasm-wasi.md) – WASI を使用してさまざまな WebAssembly 仮想マシンでシンプルな Kotlin/Wasm アプリケーションを実行する方法を学びます。

### ツール

*   [新しいDokka移行ガイド](dokka-migration.md) – Dokka Gradle プラグイン v2 への移行方法を学びます。

## Kotlin 2.1.0の互換性ガイド

Kotlin 2.1.0 は機能リリースであるため、以前のバージョンの言語で書かれたコードと互換性のない変更をもたらす可能性があります。
これらの変更の詳細なリストは、[Kotlin 2.1.0 の互換性ガイド](compatibility-guide-21.md)で確認できます。

## Kotlin 2.1.0のインストール

IntelliJ IDEA 2023.3 および Android Studio Iguana (2023.2.1) Canary 15 以降、Kotlin プラグインは IDE にバンドルされたプラグインとして配布されます。これは、JetBrains Marketplace からプラグインをインストールできなくなったことを意味します。

新しい Kotlin バージョンに更新するには、ビルドスクリプトで Kotlin のバージョンを 2.1.0 に[変更](releases.md#update-to-a-new-kotlin-version)します。