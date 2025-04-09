---
title: "Kotlin 2.1.0 の新機能"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_[リリース日: 2024年11月27日](releases#release-details)_

Kotlin 2.1.0 リリースが登場しました！主なハイライトは次のとおりです。

* **プレビューの新しい言語機能**: [件名付きの`when`のガード条件](#guard-conditions-in-when-with-a-subject)、
  [非ローカル`break`と`continue`](#non-local-break-and-continue)、および[複数ダラーストリングの interpolation](#multi-dollar-string-interpolation)。
* **K2 [compiler](#extra-compiler-checks) の更新**: [コンパイラーチェックをめぐる柔軟性の向上](#extra-compiler-checks)、および[kapt実装の改善](#improved-k2-kapt-implementation)。
* **Kotlin Multiplatform**: [Swift exportの基本的なサポート](#basic-support-for-swift-export)の導入、
  [コンパイラーオプションの stableな Gradle DSL](#new-gradle-dsl-for-compiler-options-in-multiplatform-projects-promoted-to-stable)など。
* **Kotlin/Native**: [`iosArm64`のサポート改善](#iosarm64-promoted-to-tier-1)およびその他の更新。
* **Kotlin/Wasm**: [インクリメンタルコンパイルのサポート](#support-for-incremental-compilation)を含む、複数のアップデート。
* **Gradleサポート**: [新しいバージョンのGradleおよびAndroid Gradleプラグインとの互換性の向上](#gradle-improvements)、
  [Kotlin GradleプラグインAPIのアップデート](#new-api-for-kotlin-gradle-plugin-extensions) と共に。
* **ドキュメント**: [Kotlinドキュメントの大幅な改善](#documentation-updates)。

## IDEサポート

2.1.0をサポートするKotlinプラグインは、最新のIntelliJ IDEAとAndroid Studioにバンドルされています。
IDEでKotlinプラグインをアップデートする必要はありません。
必要なのは、ビルドスクリプトでKotlinのバージョンを2.1.0に変更することだけです。

詳しくは[新しいKotlinバージョンへのアップデート](releases#update-to-a-new-kotlin-version)をご覧ください。

## 言語

K2 [compiler](#extra-compiler-checks) を搭載したKotlin 2.0.0リリースの後、JetBrainsチームは新機能による言語の改善に注力しています。
今回のリリースでは、いくつかの新しい言語設計の改善を発表できることを嬉しく思います。

これらの機能はプレビューで利用可能であり、ぜひお試しいただき、フィードバックをお寄せください。

* [件名付きの`when`のガード条件](#guard-conditions-in-when-with-a-subject)
* [非ローカル`break`と`continue`](#non-local-break-and-continue)
* [複数ダラーストリングの interpolation: 文字列リテラルでの`$`](#multi-dollar-string-interpolation)の処理を改善

:::note
これらの機能はすべて、K2モードが有効になっているIntelliJ IDEAの最新2024.3バージョンでIDEサポートが提供されています。

詳しくは[IntelliJ IDEA 2024.3のブログ記事](https://blog.jetbrains.com/idea/2024/11/intellij-idea-2024-3/)をご覧ください。

[Kotlinの言語設計機能と提案の完全なリストをご覧ください](kotlin-language-features-and-proposals)。

今回のリリースでは、次の言語アップデートも行われています。

* [](#support-for-requiring-opt-in-to-extend-apis)
* [](#improved-overload-resolution-for-functions-with-generic-types)
* [](#improved-exhaustiveness-checks-for-when-expressions-with-sealed-classes)

### 件名付きのwhenのガード条件

この機能は[プレビュー](kotlin-evolution-principles#pre-stable-features)であり、
オプトインが必要です（詳細は下記参照）。

[YouTrack](https://youtrack.jetbrains.com/issue/KT-71140) でのフィードバックをお待ちしております。

2.1.0以降、件名付きの`when`式またはステートメントでガード条件を使用できます。

ガード条件を使用すると、`when`式のbranchに複数の条件を含めることができ、
複雑な制御フローをより明示的かつ簡潔にし、コード構造を平坦化できます。

branchにガード条件を含めるには、主要な条件の後に`if`で区切って配置します。

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
        // 主要な条件のみのbranch。`Animal`が`Dog`の場合、`feedDog()`を返します
        is Animal.Dog `->` animal.feedDog()
        // 主要な条件とガード条件の両方を持つbranch。`Animal`が`Cat`で、`mouseHunter`でない場合、`feedCat()`を返します
        is Animal.Cat if !animal.mouseHunter `->` animal.feedCat()
        // 上記の条件のいずれにも一致しない場合、「Unknown animal」を返します
        else `->` println("Unknown animal")
    }
}
```

1つの`when`式で、ガード条件の有無にかかわらずbranchを組み合わせることができます。
ガード条件のあるbranch内のコードは、主要な条件とガード条件の両方が`true`の場合にのみ実行されます。
主要な条件が一致しない場合、ガード条件は評価されません。
また、ガード条件は`else if`をサポートします。

プロジェクトでガード条件を有効にするには、次のコンパイラーオプションをコマンドラインで使用します。

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

### 非ローカルbreakとcontinue

この機能は[プレビュー](kotlin-evolution-principles#pre-stable-features)であり、
オプトインが必要です（詳細は下記参照）。

[YouTrack](https://youtrack.jetbrains.com/issue/KT-1436) でのフィードバックをお待ちしております。

Kotlin 2.1.0では、もう1つの長らく待ち望まれていた機能、非ローカル`break`と`continue`を使用する機能のプレビューが追加されました。
この機能により、inline関数のスコープで使用できるツールセットが拡張され、プロジェクト内のboilerplateコードが削減されます。

以前は、非ローカルreturnのみを使用できました。
Kotlinは、非ローカルに`break`と`continue` [jump expressions](returns) もサポートするようになりました。
これは、ループを囲むinline関数に引数として渡されるラムダ内で適用できることを意味します。

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

プロジェクトでこの機能を試すには、コマンドラインで`-Xnon-local-break-continue`コンパイラーオプションを使用します。

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

この機能を将来のKotlinリリースでStableにする予定です。
非ローカル`break`と`continue`の使用中に問題が発生した場合は、
[issue tracker](https://youtrack.jetbrains.com/issue/KT-1436)にご報告ください。

### 複数ダラーストリングの interpolation

この機能は[プレビュー](kotlin-evolution-principles#pre-stable-features)であり、
オプトインが必要です（詳細は下記参照）。

[YouTrack](https://youtrack.jetbrains.com/issue/KT-2425) でのフィードバックをお待ちしております。

Kotlin 2.1.0では、複数ダラーストリングのinterpolationのサポートが導入され、
文字列リテラル内でダラー記号（`$`)がどのように処理されるかが改善されます。
この機能は、テンプレートエンジン、JSONスキーマ、その他のデータ形式など、複数のダラー記号が必要なコンテキストで役立ちます。

Kotlinの文字列interpolationは、1つのダラー記号を使用します。
ただし、文字列リテラルでリテラルのダラー記号を使用するには、
金融データやテンプレートシステムで一般的ですが、`${'`のような回避策が必要でした。
複数ダラーの interpolation機能を有効にすると、interpolationをトリガーするダラー記号の数を構成でき、
少ないダラー記号は文字列リテラルとして扱われます。

以下は、`$`を使用してプレースホルダーを含むJSONスキーマの複数行文字列を生成する方法の例です。

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

この例では、最初の`$`は、interpolationをトリガーするには**2つのダラー記号**(`$$`)が必要であることを意味します。
これにより、`$schema`、`$id`、および`$dynamicAnchor`がinterpolationマーカーとして解釈されるのを防ぎます。

このアプローチは、プレースホルダー構文にダラー記号を使用するシステムを扱う場合に特に役立ちます。

この機能を有効にするには、次のコンパイラーオプションをコマンドラインで使用します。

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

コードがすでに単一のダラー記号を使用した標準の文字列interpolationを使用している場合は、変更は必要ありません。
文字列でリテラルのダラー記号が必要な場合はいつでも`$`を使用できます。

### APIを拡張するためにオプトインを必須にするサポート

Kotlin 2.1.0では、[`@SubclassOptInRequired`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-subclass-opt-in-required/) アノテーションが導入されました。
これにより、ライブラリの作成者は、ユーザーが実験的なinterfaceを実装したり、実験的なクラスを拡張したりする前に、明示的なオプトインを要求できます。

この機能は、ライブラリAPIが使用するのに十分安定しているものの、新しいabstract関数で進化する可能性がある場合に、継承に対して不安定になる可能性がある場合に役立ちます。

API要素にオプトイン要件を追加するには、アノテーションクラスへの参照とともに`@SubclassOptInRequired`アノテーションを使用します。

```kotlin
@RequiresOptIn(
level = RequiresOptIn.Level.WARNING,
message = "Interfaces in this library are experimental"
)
annotation class UnstableApi()

@SubclassOptInRequired(UnstableApi::class)
interface CoreLibraryApi
```

この例では、`CoreLibraryApi`interfaceを実装する前に、ユーザーはオプトインする必要があります。
ユーザーは次のようにオプトインできます。

```kotlin
@OptIn(UnstableApi::class)
interface MyImplementation: CoreLibraryApi
```

`@SubclassOptInRequired`アノテーションを使用してオプトインを要求する場合、
この要件は[innerまたはnested class](nested-classes)には伝播されません。

:::

APIで`@SubclassOptInRequired`アノテーションを使用する方法の実際の例については、
`kotlinx.coroutines`ライブラリの[`SharedFlow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-shared-flow/)
interfaceをご覧ください。

### ジェネリック型を持つ関数のオーバーロード解決の改善

以前は、関数にいくつかのオーバーロードがあり、一部はジェネリック型のvalueパラメーターを持ち、
他は同じ位置に関数型がある場合、解決の動作が一貫しない場合がありました。

これにより、オーバーロードがメンバー関数であるか拡張関数であるかによって、動作が異なる可能性がありました。
次に例を示します。

```kotlin
class KeyValueStore<K, V> {
    fun store(key: K, value: V) {} // 1
    fun store(key: K, lazyValue: () `->` V) {} // 2
}

fun <K, V> KeyValueStore<K, V>.storeExtension(key: K, value: V) {} // 1 
fun <K, V> KeyValueStore<K, V>.storeExtension(key: K, lazyValue: () `->` V) {} // 2

fun test(kvs: KeyValueStore<String, Int>) {
    // Member functions
    kvs.store("", 1)    // Resolves to 1
    kvs.store("") { 1 } // Resolves to 2

    // Extension functions
    kvs.storeExtension("", 1)    // Resolves to 1
    kvs.storeExtension("") { 1 } // Doesn't resolve
}
```

この例では、`KeyValueStore`クラスには`store()`関数の2つのオーバーロードがあり、
1つのオーバーロードにはジェネリック型`K`と`V`を持つ関数パラメーターがあり、
もう1つにはジェネリック型`V`を返すラムダ関数があります。
同様に、拡張関数`storeExtension()`にも2つのオーバーロードがあります。

`store()`関数がラムダ関数の有無にかかわらず呼び出された場合、
コンパイラーは正しいオーバーロードを正常に解決しました。
ただし、拡張関数`storeExtension()`がラムダ関数を使用して呼び出された場合、
コンパイラーは両方のオーバーロードが適用可能であると誤って見なしたため、正しいオーバーロードを解決しませんでした。

この問題を解決するために、ジェネリック型を持つ関数パラメーターが別の引数からの情報に基づいてラムダ関数を受け入れることができない場合、
コンパイラーが可能なオーバーロードを破棄できるように、新しいheuristicを導入しました。
この変更により、メンバー関数と拡張関数の動作が一貫し、
Kotlin 2.1.0ではデフォルトで有効になっています。

### sealed classを使用したwhen式の網羅性チェックの改善

以前のバージョンのKotlinでは、`sealed class`階層のすべてのケースがカバーされている場合でも、
コンパイラーはsealedな上限を持つ型パラメーターの`when`式で`else`branchを必要としていました。
この動作はKotlin 2.1.0で修正および改善され、
網羅性チェックがより強力になり、冗長な`else`branchを削除して、
`when`式をよりクリーンで直感的に保つことができます。

この変更を示す例を次に示します。

```kotlin
sealed class Result
object Error: Result()
class Success(val value: String): Result()

fun <T : Result> render(result: T) = when (result) {
    Error `->` "Error!"
    is Success `->` result.value
    // Requires no else branch
}
```

## Kotlin K2 [compiler](#extra-compiler-checks)

Kotlin 2.1.0では、K2 [compiler](#extra-compiler-checks) は、[コンパイラーチェックの操作時](#extra-compiler-checks)に、より柔軟性を提供するようになりました。
および[警告](#global-warning-suppression) だけでなく、[kaptプラグインのサポートが改善されました](#improved-k2-kapt-implementation)。

### 追加のコンパイラーチェック

Kotlin 2.1.0では、K2 [compiler](#extra-compiler-checks) で追加のチェックを有効にできるようになりました。
これらは、通常コンパイルには不可欠ではないものの、
次のケースを検証したい場合に役立つ、追加の宣言、式、および型チェックです。

| チェックの種類                                      | コメント                                                                             |
|-------------------------------------------------|-------------------------------------------------------------------------------------|
| `REDUNDANT_NULLABLE`                              | `Boolean??` が `Boolean?` の代わりに使用されている                                           |
| `PLATFORM_CLASS_MAPPED_TO_KOTLIN`                  | `java.lang.String` が `kotlin.String` の代わりに使用されている                                |
| `ARRAY_EQUALITY_OPERATOR_CAN_BE_REPLACED_WITH_EQUALS` | `arrayOf("") == arrayOf("")` が `arrayOf("").contentEquals(arrayOf(""))` の代わりに使用されている |
| `REDUNDANT_CALL_OF_CONVERSION_METHOD`              | `42.toInt()` が `42` の代わりに使用されている                                                |
| `USELESS_CALL_ON_NOT_NULL`                         | `"".orEmpty()` が `""` の代わりに使用されている                                                 |
| `REDUNDANT_SINGLE_EXPRESSION_STRING_TEMPLATE`      | `"$string"` が `string` の代わりに使用されている                                               |
| `UNUSED_ANONYMOUS_PARAMETER`                       | パラメーターがラムダ式で渡されているが、使用されていない                                               |
| `REDUNDANT_VISIBILITY_MODIFIER`                    | `public class Klass` が `class Klass` の代わりに使用されている                                  |
| `REDUNDANT_MODALITY_MODIFIER`                      | `final class Klass` が `class Klass` の代わりに使用されている                                   |
| `REDUNDANT_SETTER_PARAMETER_TYPE`                  | `set(value: Int)` が `set(value)` の代わりに使用されている                                      |
| `CAN_BE_VAL`                                     | `var local = 0` が定義されているが、再割り当てされていない。代わりに `val local = 42` にできる |
| `ASSIGNED_VALUE_IS_NEVER_READ`                   | `val local = 42` が定義されているが、コード内でその後使用されていない                               |
| `UNUSED_VARIABLE`                                  | `val local = 0` が定義されているが、コードで使用されていない                                            |
| `REDUNDANT_RETURN_UNIT_TYPE`                     | `fun foo(): Unit {}` が `fun foo() {}` の代わりに使用されている                                    |
| `UNREACHABLE_CODE`                                 | コードステートメントが存在するが、実行できない                                                       |

チェックがtrueの場合、問題の修正方法に関する提案を含むコンパイラー警告が表示されます。

追加のチェックはデフォルトで無効になっています。
有効にするには、コマンドラインで`-Wextra`コンパイラーオプションを使用するか、
Gradleビルドファイルの`compilerOptions {}`ブロックで`extraWarnings`を指定します。

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        extraWarnings.set(true)
    }
}
```

コンパイラーオプションの定義方法と使用方法の詳細については、
[Kotlin Gradleプラグインのコンパイラーオプション](gradle-compiler-options) を参照してください。

### グローバル警告の抑制

2.1.0では、Kotlin [compiler](#extra-compiler-checks) は、要求の多かった機能である警告をグローバルに抑制する機能を受け取りました。

コマンドラインで`-Xsuppress-warning=WARNING_NAME`構文を使用するか、
ビルドファイルの`compilerOptions {}`ブロックで`freeCompilerArgs`属性を使用して、プロジェクト全体の特定の警告を抑制できるようになりました。

たとえば、プロジェクトで[追加のコンパイラーチェック](#extra-compiler-checks) が有効になっているが、
そのうちの1つを抑制したい場合は、次のように使用します。

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        extraWarnings.set(true)
        freeCompilerArgs.add("-Xsuppress-warning=CAN_BE_VAL")
    }
}
```

警告を抑制したいが、その名前がわからない場合は、要素を選択し、電球アイコンをクリックするか（または<shortcut>Cmd + Enter</shortcut>/<shortcut>Alt + Enter</shortcut>を使用）：

<img src="/img/warning-name-intention.png" alt="Warning name intention" width="500" style={{verticalAlign: 'middle'}}/>

新しいコンパイラーオプションは現在[実験的](components-stability#stability-levels-explained)です。
次の詳細にも注意してください。

* エラーの抑制は許可されていません。
* 不明な警告名を渡すと、コンパイルがエラーになります。
* 一度に複数の警告を指定できます。
  
   <Tabs>
   <TabItem value="Command line" label="コマンドライン">

   ```bash
   kotlinc -Xsuppress-warning=NOTHING_TO_INLINE -Xsuppress-warning=NO_TAIL_CALLS_FOUND main.kt
   ```

   </TabItem>
   <TabItem value="Build file" label="ビルドファイル">

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

   </TabItem>
   </Tabs>

### K2 kapt実装の改善

:::note
K2 [compiler](#extra-compiler-checks) のkaptプラグイン（K2 kapt）は[Alpha](components-stability#stability-levels-explained)段階にあります。
いつでも変更される可能性があります。

[YouTrack](https://youtrack.jetbrains.com/issue/KT-71439/K2-kapt-feedback) でのフィードバックをお待ちしております。

現在、[kapt](kapt)プラグインを使用しているプロジェクトは、デフォルトでK1 [compiler](#extra-compiler-checks) で動作し、
Kotlinバージョン1.9までをサポートしています。

Kotlin 1.9.20では、K2 [compiler](#extra-compiler-checks) （K2 kapt）を使用したkaptプラグインの実験的な実装を開始しました。
技術的な問題とパフォーマンスの問題を軽減するために、K2 kaptの内部実装を改善しました。

新しいK2 kapt実装では新機能は導入されていませんが、
そのパフォーマンスは以前のK2 kapt実装と比較して大幅に向上しています。
さらに、K2 kaptプラグインの動作は、K1 kaptの動作にかなり近づきました。

新しいK2 kaptプラグイン実装を使用するには、以前のK2 kaptプラグインと同じように有効にします。
プロジェクトの`gradle.properties`ファイルに次のオプションを追加します。

```kotlin
kapt.use.k2=true
```

今後のリリースでは、K2 kapt実装はK1 kaptの代わりにデフォルトで有効になるため、
手動で有効にする必要はなくなります。

新しい実装が安定する前に、[フィードバック](https://youtrack.jetbrains.com/issue/KT-71439/K2-kapt-feedback)をお寄せいただければ幸いです。

### 符号なし型と非プリミティブ型間のオーバーロード競合の解決

このリリースでは、
符号なし型と非プリミティブ型に対して関数がオーバーロードされた場合に以前のバージョンで発生する可能性のある、
オーバーロード競合の解決に関する問題に対処します。
次の例のように:

#### オーバーロードされた拡張関数

```kotlin
fun Any.doStuff() = "Any"
fun UByte.doStuff() = "UByte"

fun main() {
    val uByte: UByte = UByte.MIN_VALUE
    uByte.doStuff() // Kotlin 2.1.0より前のオーバーロード解決のあいまいさ
}
```

以前のバージョンでは、`uByte.doStuff()`を呼び出すと、`Any`拡張と`UByte`拡張の両方が適用可能なため、あいまいさが発生しました。

#### オーバーロードされたトップレベル関数

```kotlin
fun doStuff(value: Any) = "Any"
fun doStuff(value: UByte) = "UByte"

fun main() {
    val uByte: UByte = UByte.MIN_VALUE
    doStuff(uByte) // Kotlin 2.1.0より前のオーバーロード解決のあいまいさ
}
```

同様に、コンパイラーが`Any`バージョンまたは`UByte`バージョンのどちらを使用するかを判断できなかったため、`doStuff(uByte)`の呼び出しはあいまいでした。
2.1.0では、コンパイラーはこれらのケースを正しく処理し、
より具体的な型である`UByte`を優先することであいまいさを解決します。

## Kotlin/JVM

バージョン2.1.0以降、[compiler](#extra-compiler-checks) はJava 23 bytecodeを含むクラスを生成できます。

### JSpecify null許容ミスマッチ診断の重大度をstrictに変更

Kotlin 2.1.0では、`org.jspecify.annotations`からのnull許容アノテーションの厳密な処理が適用され、
Java相互運用性の型安全性が向上しています。

次のnull許容アノテーションが影響を受けます。

* `org.jspecify.annotations.Nullable`
* `org.jspecify.annotations.NonNull`
* `org.jspecify.annotations.NullMarked`
* `org.jspecify.nullness`のレガシーアノテーション（JSpecify 0.2以前）

Kotlin 2.1.0以降、null許容ミスマッチはデフォルトで警告からエラーに引き上げられます。
これにより、`@NonNull`や`@Nullable`などのアノテーションが型チェック中に適用され、
実行時の予期しないnull許容の問題を防ぎます。

`@NullMarked`アノテーションは、そのスコープ内のすべてのメンバーのnull許容にも影響を与え、
アノテーション付きJavaコードを使用する場合の動作をより予測可能にします。

新しいデフォルトの動作を示す例を次に示します。

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

これらのアノテーションの診断の重大度を手動で制御できます。
これを行うには、`-Xnullability-annotations`コンパイラーオプションを使用して、モードを選択します。

* `ignore`: null許容ミスマッチを無視します。
* `warning`: null許容ミスマッチの警告を報告します。
* `strict`: null許容ミスマッチのエラーを報告します（デフォルトモード）。

詳しくは、[Null許容アノテーション](java-interop#nullability-annotations)をご覧ください。

## Kotlin Multiplatform

Kotlin 2.1.0では、[Swift exportの基本的なサポート](#basic-support-for-swift-export)が導入され、
[Kotlin Multiplatformライブラリの公開が容易になります](#ability-to-publish-kotlin-libraries-from-any-host)。
また、[コンパイラーオプションを構成するための新しいDSL](#new-gradle-dsl-for-compiler-options-in-multiplatform-projects-promoted-to-stable)を安定させ、
[Isolated Projects機能のプレビュー](#preview-gradle-s-isolated-projects-in-kotlin-multiplatform)をもたらす、Gradle周辺の改善にも焦点が当てられています。

### Multiplatformプロジェクトのコンパイラーオプションの新しいGradle DSLがStableに昇格

Kotlin 2.0.0では、[新しいExperimental Gradle DSLを導入しました](whatsnew20#new-gradle-dsl-for-compiler-options-in-multiplatform-projects)。
Multiplatformプロジェクト全体でコンパイラーオプションの構成を簡素化するためです。
Kotlin 2.1.0では、このDSLはStableに昇格しました。

プロジェクト全体の構成には、3つのレイヤーがあります。最も高いのは拡張機能レベル、
次にターゲットレベル、最も低いのはコンパイルユニット（通常はコンパイルタスク）です。

<img src="/img/compiler-options-levels.svg" alt="Kotlin compiler options levels" width="700" style={{verticalAlign: 'middle'}}/>

さまざまなレベルと、コンパイラーオプションをレベル間で構成する方法について詳しくは、
[コンパイラーオプション](multiplatform-dsl-reference#compiler-options)をご覧ください。

### Kotlin MultiplatformでのGradleのIsolated Projectsのプレビュー

この機能は[実験的](components-stability#stability-levels-explained)であり、現在GradleではプレAlpha段階にあります。
Gradleバージョン8.10でのみ評価目的で使用してください。この機能はいつでも削除または変更される可能性があります。

[YouTrack](https://youtrack.jetbrains.com/issue/KT-57279/Support-Gradle-Project-Isolation-Feature-for-Kotlin-Multiplatform) でのフィードバックをお待ちしております。
オプトインが必要です（詳細は下記参照）。

Kotlin 2.1.0では、
MultiplatformプロジェクトでGradleの[Isolated Projects](https://docs.gradle.org/current/userguide/isolated_projects.html) 機能をプレビューできます。

GradleのIsolated Projects機能は、個々のGradleプロジェクトの構成を相互に「分離」することで、
ビルドパフォーマンスを向上させます。
各プロジェクトのビルドロジックは、他のプロジェクトのmutableな状態に直接アクセスすることが制限されているため、
安全に並行して実行できます。
この機能をサポートするために、Kotlin Gradleプラグインのモデルにいくつかの変更を加えました。
このプレビュー段階で皆様のエクスペリエンスをお聞きしたいと考えています。

Kotlin Gradleプラグインの新しいモデルを有効にする方法は2つあります。

* オプション1: **Isolated Projectsを有効にせずに互換性をテストする** –
  Isolated Projects機能を有効にせずにKotlin Gradleプラグインの新しいモデルとの互換性を確認するには、
  プロジェクトの`gradle.properties`ファイルに次のGradleプロパティを追加します。

  ```none
  # gradle.properties
  kotlin.kmp.isolated-projects.support=enable
  ```

* オプション2: **Isolated Projectsを有効にしてテストする** –
  GradleでIsolated Projects機能を有効にすると、Kotlin Gradleプラグインが自動的に構成され、新しいモデルが使用されます。
  Isolated Projects機能を有効にするには、[システムプロパティを設定します](https://docs.gradle.org/current/userguide/isolated_projects.html#how_do_i_use_it)。
  この場合、Kotlin GradleプラグインのGradleプロパティをプロジェクトに追加する必要はありません。

### Swift exportの基本的なサポート

この機能は現在、開発の初期段階にあります。いつでも削除または変更される可能性があります。
オプトインが必要です（詳細は下記参照）。評価目的でのみ使用してください。
[YouTrack](https://kotl.in/issue) でのフィードバックをお待ちしております。

バージョン2.1.0は、KotlinでのSwift exportのサポートを提供する第一歩を踏み出しました。
これにより、Objective-Cヘッダーを使用せずに、KotlinソースをSwift interfaceに直接exportできます。
これにより、AppleターゲットのMultiplatform開発が容易になるはずです。

現在の基本的なサポートには、次の機能が含まれています。

* Kotlinから複数のGradleモジュールをSwiftに直接exportできます。
* `moduleName`プロパティを使用して、カスタムSwiftモジュール名を定義できます。
* `flattenPackage`プロパティを使用して、パッケージ構造のcollapsルールを設定できます。

次のビルドファイルをプロジェクトで開始点として使用して、Swift exportを設定できます。

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

Swift exportがすでに設定されている[公開サンプル](https://github.com/Kotlin/swift-export-sample)をcloneすることもできます。

[compiler](#extra-compiler-checks) は、必要なすべてのファイル（`swiftmodule`ファイル、
staticな`a`ライブラリ、ヘッダーファイル、`modulemap`ファイルなど）を自動的に生成し、
Xcodeからアクセスできるアプリのビルドディレクトリにコピーします。

#### Swift exportを有効にする方法

この機能は現在、開発の初期段階にすぎないことに注意してください。

Swift exportは現在、
[direct integration](multiplatform-direct-integration) を使用してiOSフレームワークをXcodeプロジェクトに接続するプロジェクトで動作します。
これは、Android Studioまたは[web wizard](https://kmp.jetbrains.com/) で作成されたKotlin Multiplatformプロジェクトの標準構成です。

プロジェクトでSwift exportを試すには:

1. 次のGradleオプションを`gradle.properties`ファイルに追加します。

   ```none
   # gradle.properties
   kotlin.experimental.swift-export.enabled=true
   ```

2. Xcodeで、プロジェクト設定を開きます。
3. **Build Phases**タブで、`embedAndSignAppleFrameworkForXcode`タスクを含む**Run Script**フェーズを見つけます。
4. スクリプトを調整して、実行スクリプトフェーズで代わりに`embedSwiftExportForXcode`タスクを使用します。

   ```bash
   ./gradlew :<Shared module name>:embedSwiftExportForXcode
   ```

   <img src="/img/xcode-swift-export-run-script-phase.png" alt="Add the Swift export script" width="700" style={{verticalAlign: 'middle'}}/>

#### Swift exportに関するフィードバックをお寄せください

今後のKotlinリリースでSwift exportのサポートを拡張および安定化する予定です。
[このYouTrack issue](https://youtrack.jetbrains.com/issue/KT-64572) にフィードバックをお寄せください。

### 任意のホストからKotlinライブラリを公開する機能

この機能は現在[実験的](components-stability#stability-levels-explained)です。
オプトインが必要です（詳細は下記参照）。評価目的でのみ使用してください。
[YouTrack](https://youtrack.jetbrains.com/issue/KT-71290) でのフィードバックをお待ちしております。

Kotlin [compiler](#extra-compiler-checks) は、Kotlinライブラリを公開するために`.klib`アーティファクトを生成します。
以前は、必要なアーティファクトは任意のホストから取得できましたが、Macマシンを必要とするAppleプラットフォームターゲットは例外でした。
これにより、iOS、macOS、tvOS、およびwatchOSターゲットを対象とするKotlin Multiplatformプロジェクトに特別な制限が課せられました。

Kotlin 2.1.0では、この制限が解除され、クロスコンパイルのサポートが追加されました。
これで、任意のホストを使用して`.klib`アーティファクトを生成できるようになり、