[//]: # (title: Kotlin 2.1.0の新機能)

_[リリース日: 2024年11月27日](releases.md#release-details)_

Kotlin 2.1.0がリリースされました！主なハイライトは以下の通りです。

*   **プレビュー版の新言語機能**: [主題付き`when`式におけるガード条件](#guard-conditions-in-when-with-a-subject)、
    [非ローカルな`break`と`continue`](#non-local-break-and-continue)、および[複数ドル記号の文字列補間](#multi-dollar-string-interpolation)。
*   **K2コンパイラの更新**: [コンパイラチェックの柔軟性向上](#extra-compiler-checks)と[kapt実装の改善](#improved-k2-kapt-implementation)。
*   **Kotlin Multiplatform**: [Swiftエクスポートの基本サポート](#basic-support-for-swift-export)が導入され、
    [コンパイラオプションの安定版Gradle DSL](#new-gradle-dsl-for-compiler-options-in-multiplatform-projects-promoted-to-stable)などが追加されました。
*   **Kotlin/Native**: [`iosArm64`のサポート改善](#iosarm64-promoted-to-tier-1)およびその他の更新。
*   **Kotlin/Wasm**: [インクリメンタルコンパイルのサポート](#support-for-incremental-compilation)を含む複数の更新。
*   **Gradleのサポート**: [新しいGradleバージョンおよびAndroid Gradleプラグインとの互換性向上](#gradle-improvements)、
    さらに[Kotlin GradleプラグインAPIの更新](#new-api-for-kotlin-gradle-plugin-extensions)。
*   **ドキュメント**: [Kotlinドキュメントの大幅な改善](#documentation-updates)。

## IDEサポート

2.1.0をサポートするKotlinプラグインは、最新のIntelliJ IDEAおよびAndroid Studioにバンドルされています。
IDEのKotlinプラグインを更新する必要はありません。
必要なのは、ビルドスクリプトでKotlinのバージョンを2.1.0に変更することだけです。

詳細は[新しいKotlinバージョンへの更新](releases.md#update-to-a-new-kotlin-version)を参照してください。

## 言語

K2コンパイラを搭載したKotlin 2.0.0のリリース後、JetBrainsチームは新機能による言語の改善に注力しています。
このリリースでは、いくつかの新しい言語設計の改善点を発表できることを嬉しく思います。

これらの機能はプレビュー版で利用可能ですので、ぜひお試しいただき、フィードバックをお寄せください。

*   [主題付き`when`式におけるガード条件](#guard-conditions-in-when-with-a-subject)
*   [非ローカルな`break`と`continue`](#non-local-break-and-continue)
*   [複数ドル記号補間: 文字列リテラル内の`$`の取り扱い改善](#multi-dollar-string-interpolation)

> {style="tip"}
> すべての機能は、K2モードが有効になっている最新のIntelliJ IDEA 2024.3バージョンでIDEサポートが提供されています。
>
> 詳細は[IntelliJ IDEA 2024.3ブログ投稿](https://blog.jetbrains.com/idea/2024/11/intellij-idea-2024-3/)でご確認ください。

[Kotlin言語設計の機能と提案の全リスト](kotlin-language-features-and-proposals.md)を参照してください。

このリリースには、以下の言語更新も含まれています。

*   [](#support-for-requiring-opt-in-to-extend-apis)
*   [](#improved-overload-resolution-for-functions-with-generic-types)
*   [](#improved-exhaustiveness-checks-for-when-expressions-with-sealed-classes)

### 主題付き`when`式におけるガード条件

> {style="warning"}
> この機能は[プレビュー版](kotlin-evolution-principles.md#pre-stable-features)であり、
> オプトインが必要です（詳細は下記参照）。
>
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-71140)でフィードバックをお寄せいただけると幸いです。

2.1.0以降、主題を持つ`when`式またはステートメントでガード条件を使用できます。

ガード条件を使用すると、`when`式のブランチに複数の条件を含めることができ、
これにより、複雑な制御フローがより明示的かつ簡潔になり、コード構造もフラット化されます。

ブランチにガード条件を含めるには、プライマリ条件の後に`if`で区切って配置します。

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
        // プライマリ条件のみのブランチ。`animal`が`Dog`の場合に`feedDog()`を呼び出します。
        is Animal.Dog -> animal.feedDog()
        // プライマリ条件とガード条件の両方を持つブランチ。`animal`が`Cat`で`mouseHunter`でない場合に`feedCat()`を呼び出します。
        is Animal.Cat if !animal.mouseHunter -> animal.feedCat()
        // 上記の条件のいずれにも一致しない場合、「Unknown animal」を出力します。
        else -> println("Unknown animal")
    }
}
```

単一の`when`式で、ガード条件のあるブランチとないブランチを組み合わせることができます。
ガード条件を持つブランチのコードは、プライマリ条件とガード条件の両方が`true`の場合にのみ実行されます。
プライマリ条件が一致しない場合、ガード条件は評価されません。
さらに、ガード条件は`else if`をサポートします。

プロジェクトでガード条件を有効にするには、コマンドラインで以下のコンパイラオプションを使用します。

```bash
kotlinc -Xwhen-guards main.kt
```

または、Gradleビルドファイルの`compilerOptions {}`ブロックに追加します。

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xwhen-guards")
    }
}
```

### 非ローカルな`break`と`continue`

> {style="warning"}
> この機能は[プレビュー版](kotlin-evolution-principles.md#pre-stable-features)であり、
> オプトインが必要です（詳細は下記参照）。
>
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-1436)でフィードバックをお寄せいただけると幸いです。

Kotlin 2.1.0では、待望の別の機能、非ローカルな`break`と`continue`を使用する機能のプレビューが追加されます。
この機能は、インライン関数のスコープ内で使用できるツールセットを拡張し、プロジェクトのボイラープレートコードを削減します。

以前は、非ローカルリターンのみ使用できました。
現在、Kotlinは`break`と`continue`の[ジャンプ式](returns.md)も非ローカルにサポートしています。
これは、ループを囲むインライン関数に引数として渡されるラムダ内でそれらを適用できることを意味します。

```kotlin
fun processList(elements: List<Int>): Boolean {
    for (element in elements) {
        val variable = element.nullableMethod() ?: run {
            log.warning("Element is null or invalid, continuing...")
            continue
        }
        if (variable == 0) return true // 変数がゼロの場合、trueを返します
    }
    return false
}
```

プロジェクトでこの機能を試すには、コマンドラインで`-Xnon-local-break-continue`コンパイラオプションを使用します。

```bash
kotlinc -Xnon-local-break-continue main.kt
```

または、Gradleビルドファイルの`compilerOptions {}`ブロックに追加します。

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xnon-local-break-continue")
    }
}
```

将来のKotlinリリースでこの機能をStableにする予定です。
非ローカルな`break`と`continue`の使用中に問題が発生した場合は、
[課題トラッカー](https://youtrack.jetbrains.com/issue/KT-1436)にご報告ください。

### 複数ドル記号の文字列補間

> {style="warning"}
> この機能は[プレビュー版](kotlin-evolution-principles.md#pre-stable-features)であり、
> オプトインが必要です（詳細は下記参照）。
>
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-2425)でフィードバックをお寄せいただけると幸いです。

Kotlin 2.1.0では、複数ドル記号の文字列補間がサポートされ、文字列リテラル内でのドル記号 (`$`) の扱いが改善されました。
この機能は、テンプレートエンジン、JSONスキーマ、その他のデータ形式など、複数のドル記号が必要な状況で役立ちます。

Kotlinの文字列補間は、単一のドル記号を使用します。
しかし、金融データやテンプレートシステムで一般的な文字列リテラルにドル記号を使用するには、`${'$'}`のような回避策が必要でした。
複数ドル記号補間機能を有効にすると、いくつのドル記号で補間をトリガーするかを設定でき、少ないドル記号は文字列リテラルとして扱われます。

以下に、`$`を使用してプレースホルダーを持つJSONスキーマ複数行文字列を生成する方法の例を示します。

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

この例では、最初の`$`は補間をトリガーするために**2つのドル記号** (`$`) が必要であることを意味します。
これにより、`$schema`、`$id`、`$dynamicAnchor`が補間マーカーとして解釈されるのを防ぎます。

このアプローチは、ドル記号をプレースホルダー構文に使用するシステムを扱う場合に特に役立ちます。

この機能を有効にするには、コマンドラインで以下のコンパイラオプションを使用します。

```bash
kotlinc -Xmulti-dollar-interpolation main.kt
```

または、Gradleビルドファイルの`compilerOptions {}`ブロックを更新します。

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xmulti-dollar-interpolation")
    }
}
```

コードがすでに単一のドル記号による標準の文字列補間を使用している場合、変更は不要です。
文字列リテラルにドル記号が必要な場合は、いつでも`$`を使用できます。

### API拡張のためのオプトイン要求のサポート

Kotlin 2.1.0では、[`@SubclassOptInRequired`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-subclass-opt-in-required/)アノテーションが導入されました。これにより、ライブラリ作者は、ユーザーが実験的なインターフェースを実装したり、実験的なクラスを拡張したりする前に、明示的なオプトインを要求できます。

この機能は、ライブラリAPIが使用するには十分に安定しているものの、新しい抽象関数によって進化する可能性があり、継承に対して不安定になる場合に役立ちます。

API要素にオプトイン要求を追加するには、アノテーションクラスへの参照とともに`@SubclassOptInRequired`アノテーションを使用します。

```kotlin
@RequiresOptIn(
level = RequiresOptIn.Level.WARNING,
message = "Interfaces in this library are experimental"
)
annotation class UnstableApi()

@SubclassOptInRequired(UnstableApi::class)
interface CoreLibraryApi
```

この例では、`CoreLibraryApi`インターフェースを実装する前に、ユーザーがオプトインする必要があります。
ユーザーは次のようにオプトインできます。

```kotlin
@OptIn(UnstableApi::class)
interface MyImplementation: CoreLibraryApi
```

> {style="note"}
> `@SubclassOptInRequired`アノテーションを使用してオプトインを要求する場合、その要求は[内部クラスやネストされたクラス](nested-classes.md)には伝播しません。

APIで`@SubclassOptInRequired`アノテーションを使用する実際の例については、`kotlinx.coroutines`ライブラリの[`SharedFlow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-shared-flow/)インターフェースを参照してください。

### ジェネリック型を持つ関数のオーバーロード解決の改善

以前は、関数に複数のオーバーロードがあり、その一部がジェネリック型の値パラメータを持ち、他が同じ位置に関数型を持つ場合、解決動作が一貫しないことがありました。

これは、オーバーロードがメンバー関数であるか拡張関数であるかによって異なる動作を引き起こしていました。
例:

```kotlin
class KeyValueStore<K, V> {
    fun store(key: K, value: V) {} // 1
    fun store(key: K, lazyValue: () -> V) {} // 2
}

fun <K, V> KeyValueStore<K, V>.storeExtension(key: K, value: V) {} // 1 
fun <K, V> KeyValueStore<K, V>.storeExtension(key: K, lazyValue: () -> V) {} // 2

fun test(kvs: KeyValueStore<String, Int>) {
    // メンバー関数
    kvs.store("", 1)    // 1に解決
    kvs.store("") { 1 } // 2に解決

    // 拡張関数
    kvs.storeExtension("", 1)    // 1に解決
    kvs.storeExtension("") { 1 } // 解決しない
}
```

この例では、`KeyValueStore`クラスには`store()`関数の2つのオーバーロードがあり、一方はジェネリック型`K`と`V`を持つ関数パラメータを持ち、もう一方はジェネリック型`V`を返すラムダ関数を持っています。
同様に、拡張関数`storeExtension()`にも2つのオーバーロードがあります。

ラムダ関数を使用した場合と使用しない場合の両方で`store()`関数が呼び出されたとき、コンパイラは正しいオーバーロードを正常に解決しました。
しかし、拡張関数`storeExtension()`がラムダ関数と共に呼び出されたとき、コンパイラは両方のオーバーロードが適用可能であると誤って判断したため、正しいオーバーロードを解決できませんでした。

この問題を解決するため、新しいヒューリスティックを導入しました。これにより、ジェネリック型を持つ関数パラメータが異なる引数からの情報に基づいてラムダ関数を受け入れられない場合、コンパイラは可能性のあるオーバーロードを破棄できるようになります。
この変更により、メンバー関数と拡張関数の動作が一貫し、Kotlin 2.1.0ではデフォルトで有効になっています。

### sealed classを持つ`when`式の網羅性チェックの改善

以前のバージョンのKotlinでは、`sealed class`階層のすべてのケースがカバーされている場合でも、sealedな上限を持つ型パラメータの`when`式では`else`ブランチが必要でした。
この動作はKotlin 2.1.0で対処・改善され、網羅性チェックがより強力になり、冗長な`else`ブランチを削除して`when`式をよりクリーンで直感的に保つことができるようになりました。

変更点を示す例を以下に示します。

```kotlin
sealed class Result
object Error: Result()
class Success(val value: String): Result()

fun <T : Result> render(result: T) = when (result) {
    Error -> "Error!"
    is Success -> result.value
    // elseブランチは不要
}
```

## Kotlin K2コンパイラ

Kotlin 2.1.0では、K2コンパイラは[コンパイラチェック](#extra-compiler-checks)や[警告](#global-warning-suppression)を扱う際のより高い柔軟性を提供し、さらに[kaptプラグインのサポートも改善](#improved-k2-kapt-implementation)しました。

### 追加のコンパイラチェック

Kotlin 2.1.0では、K2コンパイラで追加のチェックを有効にできるようになりました。
これらは、通常コンパイルには不可欠ではありませんが、以下のケースを検証したい場合に役立つ、追加の宣言、式、型チェックです。

| チェックタイプ | コメント |
| :-------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `REDUNDANT_NULLABLE` | `Boolean?`の代わりに`Boolean??`が使用されています |
| `PLATFORM_CLASS_MAPPED_TO_KOTLIN` | `kotlin.String`の代わりに`java.lang.String`が使用されています |
| `ARRAY_EQUALITY_OPERATOR_CAN_BE_REPLACED_WITH_EQUALS` | `arrayOf("").contentEquals(arrayOf(""))`の代わりに`arrayOf("") == arrayOf("")`が使用されています |
| `REDUNDANT_CALL_OF_CONVERSION_METHOD` | `42`の代わりに`42.toInt()`が使用されています |
| `USELESS_CALL_ON_NOT_NULL` | `""`の代わりに`"".orEmpty()`が使用されています |
| `REDUNDANT_SINGLE_EXPRESSION_STRING_TEMPLATE` | `string`の代わりに`"$string"`が使用されています |
| `UNUSED_ANONYMOUS_PARAMETER` | ラムダ式でパラメータが渡されているが、使用されていない |
| `REDUNDANT_VISIBILITY_MODIFIER` | `class Klass`の代わりに`public class Klass`が使用されています |
| `REDUNDANT_MODALITY_MODIFIER` | `class Klass`の代わりに`final class Klass`が使用されています |
| `REDUNDANT_SETTER_PARAMETER_TYPE` | `set(value)`の代わりに`set(value: Int)`が使用されています |
| `CAN_BE_VAL` | `var local = 0`が定義されているが、再割り当てされていないため、代わりに`val local = 42`にできます |
| `ASSIGNED_VALUE_IS_NEVER_READ` | `val local = 42`が定義されているが、コード内で後で使用されていない |
| `UNUSED_VARIABLE` | `val local = 0`が定義されているが、コード内で使用されていない |
| `REDUNDANT_RETURN_UNIT_TYPE` | `fun foo() {}`の代わりに`fun foo(): Unit {}`が使用されています |
| `UNREACHABLE_CODE` | コードステートメントが存在するが、実行されることはない |

チェックが真の場合、問題を修正する方法の提案とともにコンパイラの警告が表示されます。

追加チェックはデフォルトで無効になっています。
これらを有効にするには、コマンドラインで`-Wextra`コンパイラオプションを使用するか、Gradleビルドファイルの`compilerOptions {}`ブロックで`extraWarnings`を指定します。

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        extraWarnings.set(true)
    }
}
```

コンパイラオプションの定義と使用方法の詳細については、[Kotlin Gradleプラグインのコンパイラオプション](gradle-compiler-options.md)を参照してください。

### グローバルな警告抑制

2.1.0では、Kotlinコンパイラに待望の機能、すなわち警告をグローバルに抑制する機能が追加されました。

これで、コマンドラインで`-Xsuppress-warning=WARNING_NAME`構文を使用するか、ビルドファイルの`compilerOptions {}`ブロックで`freeCompilerArgs`属性を使用して、プロジェクト全体の特定の警告を抑制できます。

例えば、プロジェクトで[追加のコンパイラチェック](#extra-compiler-checks)を有効にしているが、そのうちの1つを抑制したい場合は、次のように使用します。

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        extraWarnings.set(true)
        freeCompilerArgs.add("-Xsuppress-warning=CAN_BE_VAL")
    }
}
```

警告を抑制したいがその名前がわからない場合は、要素を選択し、電球アイコンをクリック（または<shortcut>Cmd + Enter</shortcut>/<shortcut>Alt + Enter</shortcut>を使用）します。

![Warning name intention](warning-name-intention.png){width=500}

新しいコンパイラオプションは現在[Experimental](components-stability.md#stability-levels-explained)です。
以下の点にも注意してください。

*   エラーの抑制は許可されていません。
*   不明な警告名を渡すと、コンパイルエラーが発生します。
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

> {style="warning"}
> K2コンパイラのkaptプラグイン (K2 kapt) は[Alpha](components-stability.md#stability-levels-explained)版です。
> これはいつでも変更される可能性があります。
>
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-71439/K2-kapt-feedback)でフィードバックをお寄せいただけると幸いです。

現在、[kapt](kapt.md)プラグインを使用するプロジェクトは、デフォルトでK1コンパイラで動作し、Kotlinバージョン1.9までをサポートしています。

Kotlin 1.9.20では、K2コンパイラを使用したkaptプラグインの実験的な実装（K2 kapt）をリリースしました。
この度、技術的およびパフォーマンス上の問題を軽減するため、K2 kaptの内部実装を改善しました。

新しいK2 kapt実装は新機能を導入していませんが、以前のK2 kapt実装と比較してパフォーマンスが大幅に向上しました。
さらに、K2 kaptプラグインの動作はK1 kaptのそれに非常に近くなりました。

新しいK2 kaptプラグイン実装を使用するには、以前のK2 kaptプラグインと同様に有効にします。
プロジェクトの`gradle.properties`ファイルに以下のオプションを追加します。

```kotlin
kapt.use.k2=true
```

今後のリリースでは、K1 kaptの代わりにK2 kapt実装がデフォルトで有効になるため、手動で有効にする必要がなくなります。

新しい実装が安定化する前に、皆様からの[フィードバック](https://youtrack.jetbrains.com/issue/KT-71439/K2-kapt-feedback)を高く評価いたします。

### 符号なし型と非プリミティブ型間のオーバーロード競合の解決

このリリースでは、以下の例のように、以前のバージョンで関数が符号なし型と非プリミティブ型でオーバーロードされた場合に発生する可能性があったオーバーロード競合の解決問題に対処します。

#### オーバーロードされた拡張関数

```kotlin
fun Any.doStuff() = "Any"
fun UByte.doStuff() = "UByte"

fun main() {
    val uByte: UByte = UByte.MIN_VALUE
    uByte.doStuff() // Kotlin 2.1.0以前のオーバーロード解決の曖昧さ
}
```

以前のバージョンでは、`uByte.doStuff()`を呼び出すと、`Any`と`UByte`の両方の拡張が適用可能であったため、曖昧さが発生しました。

#### オーバーロードされたトップレベル関数

```kotlin
fun doStuff(value: Any) = "Any"
fun doStuff(value: UByte) = "UByte"

fun main() {
    val uByte: UByte = UByte.MIN_VALUE
    doStuff(uByte) // Kotlin 2.1.0以前のオーバーロード解決の曖昧さ
}
```

同様に、`doStuff(uByte)`の呼び出しは、コンパイラが`Any`バージョンを使用するか`UByte`バージョンを使用するかを決定できなかったため、曖昧でした。
2.1.0では、コンパイラはこれらのケースを正しく処理し、この場合`UByte`のようなより具体的な型に優先順位を付けることで曖昧さを解決します。

## Kotlin/JVM

バージョン2.1.0以降、コンパイラはJava 23バイトコードを含むクラスを生成できます。

### JSpecifyのnull許容性不一致診断の厳格度をstrictに変更

Kotlin 2.1.0では、`org.jspecify.annotations`からのnull許容性アノテーションの厳格な処理が強制され、Java相互運用における型安全性が向上します。

以下のnull許容性アノテーションが影響を受けます。

*   `org.jspecify.annotations.Nullable`
*   `org.jspecify.annotations.NonNull`
*   `org.jspecify.annotations.NullMarked`
*   `org.jspecify.nullness`のレガシーアノテーション（JSpecify 0.2以前）

Kotlin 2.1.0以降、null許容性の不一致はデフォルトで警告からエラーに引き上げられます。
これにより、型チェック中に`@NonNull`や`@Nullable`のようなアノテーションが強制され、実行時の予期しないnull許容性問題が防止されます。

`@NullMarked`アノテーションは、そのスコープ内のすべてのメンバーのnull許容性にも影響を与え、アノテーション付きのJavaコードを扱う際の動作をより予測可能にします。

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
    // nullではない結果にアクセスします（許可されています）
    sjc.foo().length

    // デフォルトのstrictモードでは結果がnull許容であるためエラーが発生します
    // エラーを回避するには、代わりに?.lengthを使用します
    sjc.bar().length
}
```

これらのアノテーションの診断の厳格度を手動で制御できます。
それには、`-Xnullability-annotations`コンパイラオプションを使用してモードを選択します。

*   `ignore`: null許容性の不一致を無視します。
*   `warning`: null許容性の不一致について警告を報告します。
*   `strict`: null許容性の不一致についてエラーを報告します（デフォルトモード）。

詳細については、[Null許容性アノテーション](java-interop.md#nullability-annotations)を参照してください。

## Kotlin Multiplatform

Kotlin 2.1.0では、[Swiftエクスポートの基本サポート](#basic-support-for-swift-export)が導入され、[Kotlin Multiplatformライブラリの公開](#ability-to-publish-kotlin-libraries-from-any-host)がより簡単になります。
また、[コンパイラオプションを設定するための新しいDSLを安定化](#new-gradle-dsl-for-compiler-options-in-multiplatform-projects-promoted-to-stable)し、[Isolated Projects機能のプレビュー](#preview-gradle-s-isolated-projects-in-kotlin-multiplatform)をもたらすGradle周辺の改善にも注力しています。

### マルチプラットフォームプロジェクトのコンパイラオプション用新しいGradle DSLがStableに昇格

Kotlin 2.0.0では、マルチプラットフォームプロジェクト全体でコンパイラオプションの設定を簡素化するために、[新しいExperimental Gradle DSLを導入](whatsnew20.md#new-gradle-dsl-for-compiler-options-in-multiplatform-projects)しました。
Kotlin 2.1.0では、このDSLはStableに昇格しました。

プロジェクト全体の構成は、現在3つの層に分かれています。最も高い層は拡張レベル、次にターゲットレベル、最も低い層はコンパイル単位（通常はコンパイルタスク）です。

![Kotlin compiler options levels](compiler-options-levels.svg){width=700}

異なるレベルと、それらの間でコンパイラオプションをどのように設定できるかについては、[コンパイラオプション](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#compiler-options)を参照してください。

### Kotlin MultiplatformにおけるGradleのIsolated Projectsのプレビュー

> {style="warning"}
> この機能は[Experimental](components-stability.md#stability-levels-explained)であり、現在Gradleではプレアルファ状態です。
> Gradleバージョン8.10でのみ、評価目的でご利用ください。この機能はいつでも削除または変更される可能性があります。
>
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-57279/Support-Gradle-Project-Isolation-Feature-for-Kotlin-Multiplatform)でフィードバックをお寄せいただけると幸いです。オプトインが必要です（詳細は下記参照）。

Kotlin 2.1.0では、マルチプラットフォームプロジェクトでGradleの[Isolated Projects](https://docs.gradle.org/current/userguide/isolated_projects.html)機能をプレビューできます。

GradleのIsolated Projects機能は、個々のGradleプロジェクトの設定を相互に「分離」することで、ビルドパフォーマンスを向上させます。
各プロジェクトのビルドロジックは、他のプロジェクトの可変状態に直接アクセスすることを制限されており、それらを安全に並行して実行できるようになります。
この機能をサポートするため、Kotlin Gradleプラグインのモデルにいくつかの変更を加えました。このプレビュー期間中の皆様の経験についてお聞かせいただくことに興味があります。

Kotlin Gradleプラグインの新しいモデルを有効にするには、2つの方法があります。

*   オプション1: **Isolated Projectsを有効にせずに互換性をテストする** –
    Isolated Projects機能を有効にせずにKotlin Gradleプラグインの新しいモデルとの互換性を確認するには、プロジェクトの`gradle.properties`ファイルに以下のGradleプロパティを追加します。

    ```none
    # gradle.properties
    kotlin.kmp.isolated-projects.support=enable
    ```

*   オプション2: **Isolated Projectsを有効にしてテストする** –
    GradleでIsolated Projects機能を有効にすると、Kotlin Gradleプラグインが新しいモデルを使用するように自動的に設定されます。
    Isolated Projects機能を有効にするには、[システムプロパティを設定](https://docs.gradle.org/current/userguide/isolated_projects.html#how_do_i_use_it)します。
    この場合、Kotlin Gradleプラグイン用のGradleプロパティをプロジェクトに追加する必要はありません。

### Swiftエクスポートの基本サポート

> {style="warning"}
> この機能は現在開発の初期段階にあります。これはいつでも削除または変更される可能性があります。
> オプトインが必要です（詳細は下記参照）、評価目的でのみ使用してください。
> [YouTrack](https://kotl.in/issue)でフィードバックをお寄せいただけると幸いです。

バージョン2.1.0では、KotlinでSwiftエクスポートのサポートを提供する第一歩を踏み出します。これにより、Objective-Cヘッダーを使用せずにKotlinソースを直接Swiftインターフェースにエクスポートできるようになります。
これにより、Appleターゲット向けのマルチプラットフォーム開発が容易になるはずです。

現在の基本サポートには、以下の機能が含まれます。

*   複数のGradleモジュールをKotlinから直接Swiftにエクスポートする機能。
*   `moduleName`プロパティでカスタムSwiftモジュール名を定義する機能。
*   `flattenPackage`プロパティでパッケージ構造の折りたたみルールを設定する機能。

Swiftエクスポートを設定するための出発点として、プロジェクトで以下のビルドファイルを使用できます。

```kotlin
// build.gradle.kts 
kotlin {

    iosX64()
    iosArm64()
    iosSimulatorArm64()

    @OptIn(ExperimentalSwiftExportDsl::class)
    swiftExport {
        // ルートモジュール名
        moduleName = "Shared"

        // 折りたたみルール
        // 生成されたSwiftコードからパッケージプレフィックスを削除します
        flattenPackage = "com.example.sandbox"

        // 外部モジュールをエクスポートする
        export(project(":subproject")) {
            // エクスポートされたモジュール名
            moduleName = "Subproject"
            // エクスポートされた依存関係の折りたたみルール
            flattenPackage = "com.subproject.library"
        }
    }
}
```

Swiftエクスポートがすでに設定されている[公開サンプル](https://github.com/Kotlin/swift-export-sample)をクローンすることもできます。

コンパイラは、必要なすべてのファイル（`swiftmodule`ファイル、静的`a`ライブラリ、ヘッダーファイル、`modulemap`ファイルを含む）を自動的に生成し、アプリのビルドディレクトリにコピーします。これはXcodeからアクセスできます。

#### Swiftエクスポートを有効にする方法

この機能は現在、開発の初期段階にあることに留意してください。

Swiftエクスポートは現在、iOSフレームワークをXcodeプロジェクトに接続するために[直接統合](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-direct-integration.html)を使用するプロジェクトで動作します。
これは、Android Studioまたは[ウェブウィザード](https://kmp.jetbrains.com/)で作成されたKotlin Multiplatformプロジェクトの標準的な構成です。

プロジェクトでSwiftエクスポートを試すには:

1.  以下のGradleオプションを`gradle.properties`ファイルに追加します。

    ```none
    # gradle.properties
    kotlin.experimental.swift-export.enabled=true
    ```

2.  Xcodeで、プロジェクト設定を開きます。
3.  **Build Phases**タブで、`embedAndSignAppleFrameworkForXcode`タスクを含む**Run Script**フェーズを見つけます。
4.  実行スクリプトフェーズで、代わりに`embedSwiftExportForXcode`タスクを特徴とするようにスクリプトを調整します。

    ```bash
    ./gradlew :<Shared module name>:embedSwiftExportForXcode
    ```

    ![Add the Swift export script](xcode-swift-export-run-script-phase.png){width=700}

#### Swiftエクスポートに関するフィードバックを残す

将来のKotlinリリースでSwiftエクスポートのサポートを拡張し、安定化する予定です。
この[YouTrack課題](https://youtrack.jetbrains.com/issue/KT-64572)にフィードバックをお寄せください。

### 任意のホストからKotlinライブラリを公開する機能

> {style="warning"}
> この機能は現在[Experimental](components-stability.md#stability-levels-explained)です。
> オプトインが必要です（詳細は下記参照）、評価目的でのみ使用してください。
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-71290)でフィードバックをお寄せいただけると幸いです。

Kotlinコンパイラは、Kotlinライブラリを公開するために`.klib`アーティファクトを生成します。
以前は、Macマシンが必要なAppleプラットフォームターゲットを除き、どのホストからでも必要なアーティファクトを取得できました。
これは、iOS、macOS、tvOS、watchOSターゲットを対象とするKotlin Multiplatformプロジェクトに特別な制約を課していました。

Kotlin 2.1.0ではこの制限を解除し、クロスコンパイルのサポートを追加しました。
これで、どのホストからでも`.klib`アーティファクトを生成できるようになり、KotlinおよびKotlin Multiplatformライブラリの公開プロセスが大幅に簡素化されるはずです。

#### 任意のホストからライブラリを公開する方法を有効にする

プロジェクトでクロスコンパイルを試すには、`gradle.properties`ファイルに以下のバイナリオプションを追加します。

```none
# gradle.properties
kotlin.native.enableKlibsCrossCompilation=true
```

この機能は現在Experimentalであり、いくつかの制限があります。Macマシンを依然として使用する必要があるのは、以下の場合です。

*   ライブラリに[cinteropの依存関係](native-c-interop.md)がある場合。
*   プロジェクトに[CocoaPods統合](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html)が設定されている場合。
*   Appleターゲット向けの[最終バイナリ](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html)をビルドまたはテストする必要がある場合。

#### 任意のホストからのライブラリ公開に関するフィードバック

将来のKotlinリリースでこの機能を安定させ、ライブラリ公開をさらに改善する予定です。
課題トラッカー[YouTrack](https://youtrack.jetbrains.com/issue/KT-71290)にフィードバックをお寄せください。

詳細については、[マルチプラットフォームライブラリの公開](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-lib-setup.html)を参照してください。

### 非圧縮klibのサポート

Kotlin 2.1.0では、非圧縮の`.klib`ファイルアーティファクトを生成できるようになりました。
これにより、klibへの依存関係を最初に展開するのではなく、直接設定するオプションが提供されます。

この変更は、Kotlin/Wasm、Kotlin/JS、Kotlin/Nativeプロジェクトのコンパイル時間とリンク時間を短縮し、パフォーマンスを向上させることもできます。

例えば、当社のベンチマークでは、1つのリンクと10のコンパイルタスクを持つプロジェクト（9つの簡素化されたプロジェクトに依存する単一のネイティブ実行可能バイナリをビルドするプロジェクト）で、総ビルド時間が約3%改善されたことを示しています。
ただし、ビルド時間への実際の影響は、サブプロジェクトの数とそのそれぞれのサイズに依存します。

#### プロジェクトの設定方法

デフォルトでは、Kotlinのコンパイルおよびリンクタスクは、新しい非圧縮アーティファクトを使用するように設定されています。

klibを解決するためのカスタムビルドロジックを設定しており、新しい非圧縮アーティファクトを使用したい場合は、Gradleビルドファイルでklibパッケージ解決の優先バリアントを明示的に指定する必要があります。

```kotlin
// build.gradle.kts
import org.jetbrains.kotlin.gradle.plugin.attributes.KlibPackaging
// ...
val resolvableConfiguration = configurations.resolvable("resolvable") {

    // 新しい非圧縮設定の場合:
    attributes.attribute(KlibPackaging.ATTRIBUTE, project.objects.named(KlibPackaging.NON_PACKED))

    // 以前の圧縮設定の場合:
    attributes.attribute(KlibPackaging.ATTRIBUTE, project.objects.named(KlibPackaging.PACKED))
}
```

非圧縮の`.klib`ファイルは、以前に圧縮されたファイルと同じパスでプロジェクトのビルドディレクトリに生成されます。
一方、圧縮されたklibは現在`build/libs`ディレクトリに配置されています。

属性が指定されていない場合、圧縮バリアントが使用されます。
以下のコンソールコマンドで、利用可能な属性とバリアントのリストを確認できます。

```shell
./gradlew outgoingVariants
```

この機能に関するフィードバックを[YouTrack](https://kotl.in/issue)にお寄せいただけると幸いです。

### 古い`android`ターゲットのさらなる非推奨化

Kotlin 2.1.0では、古い`android`ターゲット名の非推奨警告がエラーに引き上げられました。

現在、AndroidをターゲットとするKotlin Multiplatformプロジェクトでは、`androidTarget`オプションを使用することを推奨しています。
これは、GoogleからリリースされるAndroid/KMPプラグインのために`android`という名前を解放するために必要な一時的な解決策です。

新しいプラグインが利用可能になったら、さらなる移行手順を提供します。
Googleからの新しいDSLが、Kotlin MultiplatformでのAndroidターゲットサポートの推奨オプションとなるでしょう。

詳細については、[Kotlin Multiplatform互換性ガイド](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-compatibility-guide.html#rename-of-android-target-to-androidtarget)を参照してください。

### 同じ型の複数ターゲット宣言のサポート終了

Kotlin 2.1.0以前は、マルチプラットフォームプロジェクトで同じ型の複数のターゲットを宣言できました。
しかし、これによりターゲットを区別し、共有ソースセットを効果的にサポートすることが困難になっていました。
ほとんどの場合、個別のGradleプロジェクトを使用するなど、よりシンプルなセットアップの方がうまく機能します。
詳細なガイダンスと移行方法の例については、Kotlin Multiplatform互換性ガイドの[複数の類似ターゲットの宣言](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-compatibility-guide.html#declaring-several-similar-targets)を参照してください。

Kotlin 1.9.20では、マルチプラットフォームプロジェクトで同じ型の複数のターゲットを宣言した場合、非推奨警告がトリガーされました。
Kotlin 2.1.0では、この非推奨警告はKotlin/JSターゲットを除くすべてのターゲットでエラーとなりました。
Kotlin/JSターゲットが例外である理由の詳細については、[YouTrack](https://youtrack.jetbrains.com/issue/KT-47038/KJS-MPP-Split-JS-target-into-JsBrowser-and-JsNode)のこの課題を参照してください。

## Kotlin/Native

Kotlin 2.1.0には、[`iosArm64`ターゲットサポートのアップグレード](#iosarm64-promoted-to-tier-1)、[cinteropキャッシングプロセスの改善](#changes-to-cinterop-caching)、およびその他の更新が含まれています。

### `iosArm64`がTier 1に昇格

[Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)開発に不可欠な`iosArm64`ターゲットがTier 1に昇格しました。
これはKotlin/Nativeコンパイラにおける最高レベルのサポートです。

これは、ターゲットがCIパイプラインで定期的にテストされ、コンパイルと実行が可能であることを保証することを意味します。
また、ターゲットのコンパイラリリース間でのソースおよびバイナリ互換性も提供します。

ターゲットのティアの詳細については、[Kotlin/Nativeターゲットサポート](native-target-support.md)を参照してください。

### LLVMの11.1.0から16.0.0への更新

Kotlin 2.1.0では、LLVMをバージョン11.1.0から16.0.0に更新しました。
新しいバージョンにはバグ修正とセキュリティ更新が含まれています。
特定のケースでは、コンパイラの最適化とコンパイル時間の高速化も提供します。

プロジェクトにLinuxターゲットがある場合、Kotlin/NativeコンパイラがすべてのLinuxターゲットに対してデフォルトで`lld`リンカーを使用することに注意してください。

この更新はコードに影響を与えないはずですが、何か問題が発生した場合は、[課題トラッカー](http://kotl.in/issue)にご報告ください。

### cinteropにおけるキャッシングの変更

Kotlin 2.1.0では、cinteropのキャッシングプロセスに変更を加えます。
[`CacheableTask`](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/CacheableTask.html)アノテーション型は使用されなくなりました。
新しい推奨アプローチは、[`cacheIf`](https://docs.gradle.org/current/kotlin-dsl/gradle/org.gradle.api.tasks/-task-outputs/cache-if.html)出力型を使用してタスクの結果をキャッシュすることです。

これにより、[定義ファイル](native-definition-file.md)で指定されたヘッダーファイルの変更を`UP-TO-DATE`チェックが検出できなかった問題を解決し、ビルドシステムがコードを再コンパイルするのを防ぐことができます。

### mimallocメモリ割り当ての非推奨化

Kotlin 1.9.0で新しいメモリ割り当てを導入し、Kotlin 1.9.20でデフォルトで有効にしました。
新しい割り当ては、ガベージコレクションをより効率的にし、Kotlin/Nativeメモリマネージャーの実行時パフォーマンスを向上させるように設計されています。

新しいメモリ割り当ては、以前のデフォルトの割り当てである[mimalloc](https://github.com/microsoft/mimalloc)を置き換えました。
今回、Kotlin/Nativeコンパイラでmimallocを非推奨にする時が来ました。

ビルドスクリプトから`-Xallocator=mimalloc`コンパイラオプションを削除できるようになりました。
何か問題が発生した場合は、[課題トラッカー](http://kotl.in/issue)にご報告ください。

Kotlinのメモリ割り当てとガベージコレクションの詳細については、[Kotlin/Nativeメモリ管理](native-memory-manager.md)を参照してください。

## Kotlin/Wasm

Kotlin/Wasmは、[インクリメンタルコンパイルのサポート](#support-for-incremental-compilation)を含む複数の更新を受け取りました。

### インクリメンタルコンパイルのサポート

以前は、Kotlinコードに変更を加えるたびに、Kotlin/Wasmツールチェインはコードベース全体を再コンパイルする必要がありました。

2.1.0以降、Wasmターゲットでインクリメンタルコンパイルがサポートされます。
開発タスクにおいて、コンパイラは前回のコンパイルからの変更に関連するファイルのみを再コンパイルするようになり、コンパイル時間が著しく短縮されます。

この変更により、現在コンパイル速度が2倍になり、今後のリリースでさらに改善する計画があります。

現在の設定では、Wasmターゲットのインクリメンタルコンパイルはデフォルトで無効になっています。
インクリメンタルコンパイルを有効にするには、プロジェクトの`local.properties`または`gradle.properties`ファイルに以下の行を追加します。

```none
# gradle.properties
kotlin.incremental.wasm=true
```

Kotlin/Wasmのインクリメンタルコンパイルを試して、[フィードバックをお寄せください](https://youtrack.jetbrains.com/issue/KT-72158/Kotlin-Wasm-incremental-compilation-feedback)。
皆様の洞察は、この機能がより早くStableになり、デフォルトで有効になるのに役立ちます。

### ブラウザAPIがkotlinx-browserスタンドアロンライブラリに移動

以前は、ウェブAPIと関連ターゲットユーティリティの宣言はKotlin/Wasm標準ライブラリの一部でした。

このリリースでは、`org.w3c.*`の宣言がKotlin/Wasm標準ライブラリから新しい[kotlinx-browserライブラリ](https://github.com/kotlin/kotlinx-browser)に移動されました。
このライブラリには、`org.khronos.webgl`、`kotlin.dom`、`kotlinx.browser`などの他のウェブ関連パッケージも含まれています。

この分離によりモジュール性が提供され、Kotlinのリリースサイクルとは独立してウェブ関連APIを更新できるようになります。
さらに、Kotlin/Wasm標準ライブラリには、任意のJavaScript環境で利用可能な宣言のみが含まれるようになりました。

移動されたパッケージからの宣言を使用するには、プロジェクトのビルド構成ファイルに`kotlinx-browser`の依存関係を追加する必要があります。

```kotlin
// build.gradle.kts
val wasmJsMain by getting {
    dependencies {
        implementation("org.jetbrains.kotlinx:kotlinx-browser:0.3")
    }
}
```

### Kotlin/Wasmのデバッグ体験の改善

以前は、ウェブブラウザでKotlin/Wasmコードをデバッグする際、デバッグインターフェースで変数値が低レベルで表現されることがありました。
これにより、アプリケーションの現在の状態を追跡するのが困難になることがよくありました。

![Kotlin/Wasm old debugger](wasm-old-debugger.png){width=700}

この体験を改善するため、変数ビューにカスタムフォーマッタが追加されました。
この実装は、FirefoxやChromiumベースの主要ブラウザでサポートされている[カスタムフォーマッタAPI](https://firefox-source-docs.mozilla.org/devtools-user/custom_formatters/index.html)を使用しています。

この変更により、変数をよりユーザーフレンドリーで理解しやすい方法で表示・特定できるようになりました。

![Kotlin/Wasm improved debugger](wasm-debugger-improved.png){width=700}

新しいデバッグ体験を試すには:

1.  以下のコンパイラオプションを`wasmJs {}`コンパイラオプションに追加します。

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

    *   Chrome DevToolsでは、**Settings | Preferences | Console**から利用できます。

        ![Enable custom formatters in Chrome](wasm-custom-formatters-chrome.png){width=700}

    *   Firefox DevToolsでは、**Settings | Advanced settings**から利用できます。

        ![Enable custom formatters in Firefox](wasm-custom-formatters-firefox.png){width=700}

### Kotlin/Wasmバイナリのサイズ削減

プロダクションビルドによって生成されるWasmバイナリのサイズが最大30%削減され、パフォーマンスが向上する可能性があります。
これは、`--closed-world`、`--type-ssa`、`--type-merging`のBinaryenオプションがすべてのKotlin/Wasmプロジェクトで安全に使用できると見なされ、デフォルトで有効になったためです。

### Kotlin/WasmにおけるJavaScript配列相互運用性の改善

Kotlin/Wasmの標準ライブラリはJavaScript配列に`JsArray<T>`型を提供しますが、`JsArray<T>`をKotlinのネイティブな`Array`型または`List`型に変換する直接的なメソッドはありませんでした。

このギャップにより、配列変換のためのカスタム関数を作成する必要があり、KotlinとJavaScriptコード間の相互運用が複雑になっていました。

このリリースでは、`JsArray<T>`を`Array<T>`に、またはその逆に自動変換するアダプター関数が導入され、配列操作が簡素化されます。

ジェネリック型間の変換の例を示します: Kotlin `List<T>` および `Array<T>` から JavaScript `JsArray<T>` への変換。

```kotlin
val list: List<JsString> =
    listOf("Kotlin", "Wasm").map { it.toJsString() }

// .toJsArray()を使用してListまたはArrayをJsArrayに変換します
val jsArray: JsArray<JsString> = list.toJsArray()

// .toArray()および.toList()を使用してKotlin型に変換し直します
val kotlinArray: Array<JsString> = jsArray.toArray()
val kotlinList: List<JsString> = jsArray.toList()
```

同様のメソッドは、型付き配列を対応するKotlin型（例: `IntArray`と`Int32Array`）に変換するためにも利用できます。詳細情報と実装については、[`kotlinx-browser`リポジトリ](https://github.com/Kotlin/kotlinx-browser/blob/dfbdceed314567983c98f1d66e8c2e10d99c5a55/src/wasmJsMain/kotlin/arrayCopy.kt)を参照してください。

型付き配列間の変換の例を示します: Kotlin `IntArray` から JavaScript `Int32Array` への変換。

```kotlin
import org.khronos.webgl.*

    // ...

    val intArray: IntArray = intArrayOf(1, 2, 3)
    
    // .toInt32Array()を使用してKotlin IntArrayをJavaScript Int32Arrayに変換します
    val jsInt32Array: Int32Array = intArray.toInt32Array()
    
    // toIntArray()を使用してJavaScript Int32ArrayをKotlin IntArrayに変換し直します
    val kotlinIntArray: IntArray = jsInt32Array.toIntArray()
```

### Kotlin/WasmにおけるJavaScript例外詳細へのアクセスサポート

以前は、Kotlin/WasmでJavaScript例外が発生した場合、`JsException`型は元のJavaScriptエラーの詳細なしに一般的なメッセージのみを提供していました。

Kotlin 2.1.0以降、特定のコンパイラオプションを有効にすることで、`JsException`が元のエラーメッセージとスタックトレースを含むように設定できるようになりました。
これにより、JavaScriptに起因する問題を診断するためのより多くのコンテキストが提供されます。

この動作は`WebAssembly.JSTag` APIに依存しており、これは特定のブラウザでのみ利用可能です。

*   **Chrome**: バージョン115以降でサポート
*   **Firefox**: バージョン129以降でサポート
*   **Safari**: 未サポート

デフォルトで無効になっているこの機能を有効にするには、`build.gradle.kts`ファイルに以下のコンパイラオプションを追加します。

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
        // SyntaxError: 予期しないトークン 'a', "an invalid JSON" は有効なJSONではありません

        println("Message: ${e.message}")
        // Message: 予期しないトークン 'a', "an invalid JSON" は有効なJSONではありません

        println("Stacktrace:")
        // スタックトレース:

        // 完全なJavaScriptスタックトレースを出力します
        e.printStackTrace()
    }
}
```

`-Xwasm-attach-js-exception`オプションが有効な場合、`JsException`はJavaScriptエラーから特定の詳細を提供します。
このオプションがない場合、`JsException`はJavaScriptコードの実行中に例外がスローされたことを示す一般的なメッセージのみを含みます。

### デフォルトエクスポートの非推奨化

名前付きエクスポートへの移行の一環として、以前はJavaScriptでKotlin/Wasmエクスポートにデフォルトインポートが使用された場合に、コンソールにエラーが出力されていました。

2.1.0では、名前付きエクスポートを完全にサポートするために、デフォルトインポートが完全に削除されました。

Kotlin/Wasmターゲット向けにJavaScriptでコーディングする場合、デフォルトインポートの代わりに、対応する名前付きインポートを使用する必要があります。

この変更は、名前付きエクスポートへの移行の非推奨化サイクルの最終段階を示します。

**バージョン2.0.0:** デフォルトエクスポートを介してエンティティをエクスポートすることが非推奨であることを説明する警告メッセージがコンソールに表示されました。

**バージョン2.0.20:** エラーが発生し、対応する名前付きインポートの使用が要求されました。

**バージョン2.1.0:** デフォルトインポートの使用は完全に削除されました。

### サブプロジェクト固有のNode.js設定

プロジェクトのNode.js設定は、`rootProject`の`NodeJsRootPlugin`クラスのプロパティを定義することで構成できます。
2.1.0では、新しいクラス`NodeJsPlugin`を使用して、各サブプロジェクトの設定を構成できます。
サブプロジェクトに特定のNode.jsバージョンを設定する方法の例を以下に示します。

```kotlin
// build.gradle.kts
project.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin> {
    project.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec>().version = "22.0.0"
}
```

プロジェクト全体で新しいクラスを使用するには、`allprojects {}`ブロックに同じコードを追加します。

```kotlin
// build.gradle.kts
allprojects {
    project.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin> {
        project.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec>().version = "your Node.js version"
    }
}
```

Gradleのコンベンションプラグインを使用して、設定を特定のサブプロジェクトセットに適用することもできます。

## Kotlin/JS

### プロパティにおける非識別子文字のサポート

Kotlin/JSでは以前、バッククォートで囲まれたスペースを含む[テストメソッド名](coding-conventions.md#names-for-test-methods)の使用は許可されていませんでした。

同様に、ハイフンやスペースなど、Kotlin識別子で許可されていない文字を含むJavaScriptオブジェクトのプロパティにアクセスすることはできませんでした。

```kotlin
external interface Headers {
    var accept: String?

    // ハイフンのためKotlin識別子として無効
    var `content-length`: String?
}

val headers: Headers = TODO("value provided by a JS library")
val accept = headers.accept
// プロパティ名にハイフンがあるためエラーが発生する
val length = headers.`content-length`
```

この動作はJavaScriptやTypeScriptとは異なり、これらは非識別子文字を使用してそのようなプロパティにアクセスすることを許可しています。

Kotlin 2.1.0以降、この機能はデフォルトで有効になっています。
Kotlin/JSでは、バッククォート (``) と`@JsName`アノテーションを使用して、非識別子文字を含むJavaScriptプロパティを操作したり、テストメソッドに名前を付けたりできるようになりました。

さらに、`@JsName`と`@JsQualifier`アノテーションを使用して、Kotlinのプロパティ名をJavaScriptの対応するものにマッピングできます。

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
    // JavaScriptでは、これはBar.property_example_HASHにコンパイルされます
    println(Bar.`property example`)
    // JavaScriptでは、これはfooNamespace["property example"]にコンパイルされます
    println(Foo.`property example`)
    // JavaScriptでは、これはBaz["property example"]にコンパイルされます
    println(Baz.`property example`)
}
```

### ES2015アロー関数の生成サポート

Kotlin 2.1.0では、Kotlin/JSは匿名関数の代わりに`(a, b) => expression`のようなES2015アロー関数の生成をサポートします。

アロー関数を使用すると、特に実験的な`-Xir-generate-inline-anonymous-functions`モードを使用している場合に、プロジェクトのバンドルサイズを削減できます。
これにより、生成されるコードもよりモダンなJSに適合します。

この機能は、ES2015をターゲットとする場合にデフォルトで有効になります。
または、`-Xes-arrow-functions`コマンドライン引数を使用して有効にすることもできます。

[公式ドキュメントでES2015 (ECMAScript 2015, ES6) について詳しく学ぶ](https://262.ecma-international.org/6.0/)。

## Gradleの改善

Kotlin 2.1.0はGradle 7.6.3から8.6まで完全に互換性があります。
Gradleバージョン8.7から8.10もサポートされていますが、1つの例外があります。
Kotlin Multiplatform Gradleプラグインを使用している場合、マルチプラットフォームプロジェクトでJVMターゲットの`withJava()`関数を呼び出す際に非推奨警告が表示されることがあります。
この問題はできるだけ早く修正する予定です。

詳細については、[YouTrack](https://youtrack.jetbrains.com/issue/KT-66542)の関連する課題を参照してください。

最新のGradleリリースまでのGradleバージョンを使用することもできますが、その場合、非推奨警告が表示されたり、一部の新しいGradle機能が動作しない可能性があることに注意してください。

### 最小サポートAGPバージョンが7.3.1に引き上げ

Kotlin 2.1.0以降、最小サポートされるAndroid Gradleプラグインのバージョンは7.3.1です。

### 最小サポートGradleバージョンが7.6.3に引き上げ

Kotlin 2.1.0以降、最小サポートされるGradleのバージョンは7.6.3です。

### Kotlin Gradleプラグイン拡張の新API

Kotlin 2.1.0では、Kotlin Gradleプラグインを設定するための独自のプラグインをより簡単に作成できるようにする新しいAPIが導入されました。
この変更により、`KotlinTopLevelExtension`および`KotlinTopLevelExtensionConfig`インターフェースは非推奨となり、プラグイン作者向けの以下のインターフェースが導入されました。

| 名前 | 説明 |
| :----------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `KotlinBaseExtension` | プロジェクト全体に対する共通のKotlin JVM、Android、Multiplatformプラグインオプション（<li>`org.jetbrains.kotlin.jvm`</li><li>`org.jetbrains.kotlin.android`</li><li>`org.jetbrains.kotlin.multiplatform`</li>）を設定するためのプラグインDSL拡張タイプ。 |
| `KotlinJvmExtension` | プロジェクト全体に対するKotlin **JVM**プラグインオプションを設定するためのプラグインDSL拡張タイプ。 |
| `KotlinAndroidExtension` | プロジェクト全体に対するKotlin **Android**プラグインオプションを設定するためのプラグインDSL拡張タイプ。 |

例えば、JVMとAndroidの両方のプロジェクトでコンパイラオプションを設定したい場合は、`KotlinBaseExtension`を使用します。

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

これは、JVMおよびAndroidプロジェクトの両方でJVMターゲットを17に設定します。

JVMプロジェクトに特化したコンパイラオプションを設定するには、`KotlinJvmExtension`を使用します。

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

この例では、同様にJVMプロジェクトのJVMターゲットを17に設定します。
また、プロジェクトのMaven公開も設定し、その出力がMavenリポジトリに公開されるようにします。

`KotlinAndroidExtension`もまったく同じように使用できます。

### Kotlin GradleプラグインAPIから非表示になったコンパイラシンボル

以前、KGPは`org.jetbrains.kotlin:kotlin-compiler-embeddable`をそのランタイム依存関係に含んでおり、内部コンパイラシンボルをビルドスクリプトのクラスパスで利用可能にしていました。
これらのシンボルは内部使用のみを目的としていました。

Kotlin 2.1.0以降、KGPは`org.jetbrains.kotlin:kotlin-compiler-embeddable`のクラスファイルの一部をJARファイルにバンドルし、段階的に削除しています。
この変更は、互換性問題を防止し、KGPのメンテナンスを簡素化することを目的としています。

`kotlinter`のようなプラグインなど、ビルドロジックの他の部分がKGPにバンドルされているものとは異なるバージョンの`org.jetbrains.kotlin:kotlin-compiler-embeddable`に依存している場合、競合やランタイム例外を引き起こす可能性があります。

このような問題を防止するため、KGPは現在、KGPと共にビルドクラスパスに`org.jetbrains.kotlin:kotlin-compiler-embeddable`が存在する場合に警告を表示します。

長期的な解決策として、`org.jetbrains.kotlin:kotlin-compiler-embeddable`クラスを使用するプラグイン作者である場合は、それらを分離されたクラスローダーで実行することを推奨します。
例えば、[Gradle Workers API](https://docs.gradle.org/current/userguide/worker_api.html)をクラスローダー分離またはプロセス分離で使用することで実現できます。

#### Gradle Workers APIの使用

この例は、Gradleプラグインを生成するプロジェクトでKotlinコンパイラを安全に使用する方法を示します。
まず、ビルドスクリプトにコンパイルのみの依存関係を追加します。
これにより、シンボルはコンパイル時にのみ利用可能になります。

```kotlin
// build.gradle.kts
dependencies {
    compileOnly("org.jetbrains.kotlin:kotlin-compiler-embeddable:%kotlinVersion%")
}
```

次に、Kotlinコンパイラのバージョンを出力するGradleワークアクションを定義します。

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

次に、このアクションをクラスローダー分離を使用してワーカーエクゼキュータに提出するタスクを作成します。

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

最後に、GradleプラグインでKotlinコンパイラのクラスパスを設定します。

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

### 複数の安定性構成ファイルのサポート

Composeコンパイラは複数の安定性構成ファイルを解釈できますが、以前はComposeコンパイラGradleプラグインの`stabilityConfigurationFile`オプションでは単一のファイルしか指定できませんでした。
Kotlin 2.1.0では、この機能が再構築され、単一モジュールに対して複数の安定性構成ファイルを使用できるようになりました。

*   `stabilityConfigurationFile`オプションは非推奨です。
*   新しいオプション`stabilityConfigurationFiles`があり、型は`ListProperty<RegularFile>`です。

新しいオプションを使用して、複数のファイルをComposeコンパイラに渡す方法を以下に示します。

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

一時停止可能なコンポジションは、コンパイラがスキップ可能な関数を生成する方法を変更する新しいExperimental機能です。
この機能を有効にすると、コンポジションは実行時にスキップポイントで一時停止でき、長時間実行されるコンポジションプロセスを複数のフレームに分割できます。
一時停止可能なコンポジションは、レイジーリストやその他のパフォーマンスを重視するコンポーネントで、ブロッキング方式で実行された場合にフレーム落ちを引き起こす可能性のあるコンテンツをプリフェッチするために使用されます。

一時停止可能なコンポジションを試すには、ComposeコンパイラのGradle構成に以下の機能フラグを追加します。

```kotlin
// build.gradle.kts
composeCompiler {
    featureFlags = setOf(
        ComposeFeatureFlag.PausableComposition
    )
}
```

> {style="note"}
> この機能のランタイムサポートは`androidx.compose.runtime`の1.8.0-alpha02バージョンで追加されました。
> 古いランタイムバージョンで使用した場合、この機能フラグは効果がありません。

### openおよびオーバーライドされた@Composable関数への変更

仮想（open、abstract、およびオーバーライドされた）`@Composable`関数は、再起動可能ではなくなりました。
再起動可能なグループのコード生成は、継承で[正しく動作しない](https://issuetracker.google.com/329477544)呼び出しを生成し、ランタイムクラッシュを引き起こしていました。

これは、仮想関数が再起動またはスキップされないことを意味します。状態が無効化されるたびに、ランタイムは代わりにそれらの親コンポーザブルを再コンポジションします。
コードが再コンポジションに敏感な場合、ランタイム動作に変化が見られる可能性があります。

### パフォーマンスの改善

Composeコンパイラは以前、`@Composable`型を変換するためにモジュールのIRの完全なコピーを作成していました。
Composeに関連しない要素をコピーする際のメモリ消費量の増加とは別に、この動作は[特定のコーナーケース](https://issuetracker.google.com/365066530)でダウンストリームのコンパイラプラグインを破壊することもありました。

このコピー操作は削除され、その結果、コンパイル時間が短縮される可能性があります。

## 標準ライブラリ

### 標準ライブラリAPIの非推奨度の変更

Kotlin 2.1.0では、いくつかの標準ライブラリAPIの非推奨度が警告からエラーに引き上げられます。
これらのAPIに依存するコードがある場合は、互換性を確保するために更新する必要があります。
最も注目すべき変更点は以下の通りです。

*   **`Char`と`String`のロケール依存のケース変換関数が非推奨化:**
    `Char.toLowerCase()`、`Char.toUpperCase()`、`String.toUpperCase()`、`String.toLowerCase()`などの関数は現在非推奨であり、使用するとエラーが発生します。
    それらをロケールに依存しない関数代替または他のケース変換メカニズムに置き換えてください。
    デフォルトのロケールを引き続き使用したい場合は、`String.toLowerCase()`のような呼び出しを`String.lowercase(Locale.getDefault())`に置き換え、明示的にロケールを指定してください。
    ロケールに依存しない変換の場合は、デフォルトで不変ロケールを使用する`String.lowercase()`に置き換えてください。

*   **Kotlin/NativeフリーズAPIが非推奨化:**
    以前`@FreezingIsDeprecated`アノテーションでマークされていたフリーズ関連の宣言を使用すると、エラーが発生するようになりました。
    この変更は、スレッド間でオブジェクトを共有するためにオブジェクトのフリーズを必要としたKotlin/Nativeのレガシーメモリマネージャーからの移行を反映しています。
    新しいメモリモデルでフリーズ関連APIから移行する方法については、[Kotlin/Native移行ガイド](native-migration-guide.md#update-your-code)を参照してください。
    詳細については、[フリーズの非推奨化に関するお知らせ](whatsnew1720.md#freezing)を参照してください。

*   **`appendln()`が`appendLine()`を優先して非推奨化:**
    `StringBuilder.appendln()`および`Appendable.appendln()`関数は現在非推奨であり、使用するとエラーが発生します。
    それらを置き換えるには、代わりに`StringBuilder.appendLine()`または`Appendable.appendLine()`関数を使用してください。
    `appendln()`関数は非推奨化されています。これは、Kotlin/JVM上で、各OSで異なるデフォルト値を持つ`line.separator`システムプロパティを使用するためです。
    Kotlin/JVMでは、このプロパティはWindowsではデフォルトで`\r
` (CR LF) に、他のシステムでは`
` (LF) になります。
    一方、`appendLine()`関数は一貫して`
` (LF) を行区切り文字として使用するため、プラットフォーム間で一貫した動作を保証します。

このリリースで影響を受けるAPIの完全なリストについては、[KT-71628](https://youtrack.jetbrains.com/issue/KT-71628)のYouTrack課題を参照してください。

### java.nio.file.Pathの安定版ファイルツリー走査拡張機能

Kotlin 1.7.20では、ファイルツリーを走査できる`java.nio.file.Path`クラスのExperimental[拡張関数](extensions.md#extension-functions)が導入されました。
Kotlin 2.1.0では、以下のファイルツリー走査拡張機能が[Stable](components-stability.md#stability-levels-explained)になりました。

*   `walk()`は、指定されたパスをルートとするファイルツリーを遅延的に走査します。
*   `fileVisitor()`は、`FileVisitor`を個別に作成することを可能にします。
    `FileVisitor`は、走査中にディレクトリとファイルに対して実行されるアクションを指定します。
*   `visitFileTree(fileVisitor: FileVisitor, ...)`はファイルツリーを走査し、遭遇した各エントリで指定された`FileVisitor`を呼び出します。その内部では`java.nio.file.Files.walkFileTree()`関数を使用しています。
*   `visitFileTree(..., builderAction: FileVisitorBuilder.() -> Unit)`は、提供された`builderAction`で`FileVisitor`を作成し、`visitFileTree(fileVisitor, ...)`関数を呼び出します。
*   `sealed interface FileVisitorBuilder`は、カスタム`FileVisitor`実装を定義することを可能にします。
*   `enum class PathWalkOption`は、`Path.walk()`関数の走査オプションを提供します。

以下の例は、これらのファイル走査APIを使用してカスタム`FileVisitor`の動作を作成し、ファイルやディレクトリを訪問する際の特定の動作を定義する方法を示しています。

例えば、`FileVisitor`を明示的に作成し、後で使用することができます。

```kotlin
val cleanVisitor = fileVisitor {
    onPreVisitDirectory { directory, attributes ->
        // プレースホルダー: ディレクトリ訪問時のロジックを追加
        FileVisitResult.CONTINUE
    }

    onVisitFile { file, attributes ->
        // プレースホルダー: ファイル訪問時のロジックを追加
        FileVisitResult.CONTINUE
    }
}

// プレースホルダー: 走査前の一般的なセットアップのロジックをここに追加
projectDirectory.visitFileTree(cleanVisitor)
```

また、`builderAction`で`FileVisitor`を作成し、すぐに走査に使用することもできます。

```kotlin
projectDirectory.visitFileTree {
    // builderActionを定義:
    onPreVisitDirectory { directory, attributes ->
        // ディレクトリ訪問時のロジック
        FileVisitResult.CONTINUE
    }

    onVisitFile { file, attributes ->
        // ファイル訪問時のロジック
        FileVisitResult.CONTINUE
    }
}
```

さらに、`walk()`関数を使用して、指定されたパスをルートとするファイルツリーを走査することもできます。

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

        // .class拡張子を持つファイルを削除します
        onVisitFile { file, _ ->
            if (file.extension == "class") {
                file.deleteExisting()
            }
            FileVisitResult.CONTINUE
        }
    }

    // ルートディレクトリとファイルをセットアップ
    val rootDirectory = createTempDirectory("Project")

    // A.ktとA.classファイルを持つsrcディレクトリを作成
    rootDirectory.resolve("src").let { srcDirectory ->
        srcDirectory.createDirectory()
        srcDirectory.resolve("A.kt").createFile()
        srcDirectory.resolve("A.class").createFile()
    }

    // Project.jarファイルを持つbuildディレクトリを作成
    rootDirectory.resolve("build").let { buildDirectory ->
        buildDirectory.createDirectory()
        buildDirectory.resolve("Project.jar").createFile()
    }

    // walk()関数を使用:
    val directoryStructure = rootDirectory.walk(PathWalkOption.INCLUDE_DIRECTORIES)
        .map { it.relativeTo(rootDirectory).toString() }
        .toList().sorted()
    println(directoryStructure)
    // "[, build, build/Project.jar, src, src/A.class, src/A.kt]"

    // cleanVisitorでファイルツリーを走査し、rootDirectory.visitFileTree(cleanVisitor)のクリーンアップルールを適用
    val directoryStructureAfterClean = rootDirectory.walk(PathWalkOption.INCLUDE_DIRECTORIES)
        .map { it.relativeTo(rootDirectory).toString() }
        .toList().sorted()
    println(directoryStructureAfterClean)
    // "[, src, src/A.kt]"
}
```

## ドキュメントの更新

Kotlinドキュメントにはいくつかの注目すべき変更が加えられました。

### 言語の概念

*   [Null安全](null-safety.md)ページの改善 – コードで`null`値を安全に処理する方法を学びます。
*   [オブジェクトの宣言と式](object-declarations.md)ページの改善 – クラスを定義し、インスタンスを1ステップで作成する方法を学びます。
*   [when式とステートメント](control-flow.md#when-expressions-and-statements)セクションの改善 – `when`条件とそれを使用する方法について学びます。
*   [Kotlinロードマップ](roadmap.md)、[Kotlin進化の原則](kotlin-evolution-principles.md)、および[Kotlin言語機能と提案](kotlin-language-features-and-proposals.md)ページの更新 – Kotlinの計画、進行中の開発、および指導原則について学びます。

### Composeコンパイラ

*   [Composeコンパイラのドキュメント](compose-compiler-migration-guide.md)がコンパイラとプラグインのセクションに移動 – Composeコンパイラ、コンパイラオプション、および移行手順について学びます。

### APIリファレンス

*   新しい[Kotlin GradleプラグインAPIリファレンス](https://kotlinlang.org/api/kotlin-gradle-plugin) – Kotlin GradleプラグインとComposeコンパイラGradleプラグインのAPIリファレンスを探索します。

### マルチプラットフォーム開発

*   新しい[マルチプラットフォーム向けKotlinライブラリの構築](https://kotlinlang.org/docs/api-guidelines-build-for-multiplatform.html)ページ – Kotlin Multiplatform向けにKotlinライブラリを設計する方法を学びます。
*   新しい[Kotlin Multiplatformの概要](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)ページ – Kotlin Multiplatformの主要な概念、依存関係、ライブラリなどについて学びます。
*   更新された[Kotlin Multiplatform概要](multiplatform.topic)ページ – Kotlin Multiplatformの基本と一般的なユースケースをナビゲートします。
*   新しい[iOS統合](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-ios-integration-overview.html)セクション – Kotlin Multiplatform共有モジュールをiOSアプリに統合する方法を学びます。
*   新しい[Kotlin/Nativeの定義ファイル](native-definition-file.md)ページ – CおよびObjective-Cライブラリを使用するための定義ファイルの作成方法を学びます。
*   [WASIを始める](wasm-wasi.md) – WASIを使用して様々なWebAssembly仮想マシンでシンプルなKotlin/Wasmアプリケーションを実行する方法を学びます。

### ツール

*   [新しいDokka移行ガイド](dokka-migration.md) – Dokka Gradleプラグインv2への移行方法を学びます。

## Kotlin 2.1.0互換性ガイド

Kotlin 2.1.0は機能リリースであり、そのため、以前のバージョンの言語で書かれたコードと互換性のない変更をもたらす可能性があります。
これらの変更の詳細なリストは、[Kotlin 2.1.0互換性ガイド](compatibility-guide-21.md)で見つけることができます。

## Kotlin 2.1.0のインストール

IntelliJ IDEA 2023.3およびAndroid Studio Iguana (2023.2.1) Canary 15以降、KotlinプラグインはIDEにバンドルされたプラグインとして配布されます。これは、JetBrains Marketplaceからプラグインをインストールできなくなったことを意味します。

新しいKotlinバージョンに更新するには、ビルドスクリプトでKotlinのバージョンを2.1.0に[変更](releases.md#update-to-a-new-kotlin-version)します。