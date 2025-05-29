[//]: # (title: JavaScriptからKotlinコードを使用する)

選択された[JavaScriptモジュール](js-modules.md)システムに応じて、Kotlin/JSコンパイラは異なる出力を生成します。
しかし、一般的にKotlinコンパイラは通常のJavaScriptクラス、関数、プロパティを生成し、それらをJavaScriptコードから自由に
使用できます。ただし、いくつかの微妙な点に注意する必要があります。

## plainモードで宣言を別のJavaScriptオブジェクトに分離する

モジュール種別を明示的に`plain`に設定した場合、Kotlinは現在のモジュールからのすべてのKotlin宣言を含むオブジェクトを作成します。
これは、グローバルオブジェクトを汚染しないようにするためです。つまり、`myModule`というモジュールの場合、すべての宣言は`myModule`オブジェクトを介してJavaScriptから利用可能です。例：

```kotlin
fun foo() = "Hello"
```

これはJavaScriptから次のように呼び出せます：

```javascript
alert(myModule.foo());
```

これは、KotlinモジュールをUMD（`browser`と`nodejs`ターゲットの両方のデフォルト設定）、CommonJS、またはAMDなどのJavaScriptモジュールにコンパイルする場合には適用されません。この場合、宣言は選択したJavaScriptモジュールシステムで指定された形式で公開されます。UMDまたはCommonJSを使用する場合、たとえば、呼び出しサイトは次のようになります：

```javascript
alert(require('myModule').foo());
```

JavaScriptモジュールシステムに関する詳細については、[JavaScript Modules](js-modules.md)の記事を参照してください。

## パッケージ構造

Kotlinはそのパッケージ構造をJavaScriptに公開します。したがって、ルートパッケージで宣言を定義しない限り、
JavaScriptでは完全修飾名を使用する必要があります。例：

```kotlin
package my.qualified.packagename

fun foo() = "Hello"
```

UMDまたはCommonJSを使用する場合、たとえば、呼び出しサイトは次のようになります：

```javascript
alert(require('myModule').my.qualified.packagename.foo())
```

あるいは、モジュールシステム設定として`plain`を使用する場合：

```javascript
alert(myModule.my.qualified.packagename.foo());
```

### @JsNameアノテーション

場合によっては（例えば、オーバーロードをサポートするため）、KotlinコンパイラはJavaScriptコード内で生成された関数と属性の名前をマングルします。生成される名前を制御するには、`@JsName`アノテーションを使用できます：

```kotlin
// Module 'kjs'
class Person(val name: String) {
    fun hello() {
        println("Hello $name!")
    }

    @JsName("helloWithGreeting")
    fun hello(greeting: String) {
        println("$greeting $name!")
    }
}
```

これで、このクラスをJavaScriptから次のように使用できます：

```javascript
// If necessary, import 'kjs' according to chosen module system
var person = new kjs.Person("Dmitry");   // refers to module 'kjs'
person.hello();                          // prints "Hello Dmitry!"
person.helloWithGreeting("Servus");      // prints "Servus Dmitry!"
```

`@JsName`アノテーションを指定しない場合、対応する関数の名前には、関数シグネチャから計算されたサフィックス（例えば`hello_61zpoe`）が含まれます。

Kotlinコンパイラがマングルを適用しないケースがいくつかあることに注意してください。
- `external`宣言はマングルされません。
- `external`クラスを継承する非`external`クラス内のオーバーライドされた関数はマングルされません。

`@JsName`のパラメータは、有効な識別子である定数文字列リテラルである必要があります。
コンパイラは、識別子でない文字列を`@JsName`に渡そうとするとエラーを報告します。
次の例はコンパイル時エラーを生成します：

```kotlin
@JsName("new C()")   // error here
external fun newC()
```

### @JsExportアノテーション

> この機能は[実験的](components-stability.md#stability-levels-explained)です。
> 設計は将来のバージョンで変更される可能性があります。
>
{style="warning"} 

トップレベル宣言（クラスや関数など）に`@JsExport`アノテーションを適用すると、そのKotlin宣言をJavaScriptから利用できるようにします。このアノテーションは、ネストされたすべての宣言をKotlinで与えられた名前でエクスポートします。
`@file:JsExport`を使用してファイルレベルで適用することもできます。

エクスポートにおける曖昧さ（同名関数のオーバーロードなど）を解決するには、`@JsExport`アノテーションを`@JsName`と組み合わせて使用し、生成およびエクスポートされる関数の名前を指定できます。

現在の[IRコンパイラバックエンド](js-ir-compiler.md)では、`@JsExport`アノテーションがKotlinから関数を可視にする唯一の方法です。

マルチプラットフォームプロジェクトの場合、`@JsExport`は共通コードでも利用できます。JavaScriptターゲット向けにコンパイルする場合にのみ効果があり、プラットフォーム固有ではないKotlin宣言もエクスポートできます。

### @JsStatic

> この機能は[実験的](components-stability.md#stability-levels-explained)です。いつでも廃止または変更される可能性があります。
> 評価目的のみに使用してください。それに関するフィードバックを[YouTrack](https://youtrack.jetbrains.com/issue/KT-18891/JS-provide-a-way-to-declare-static-members-JsStatic)でお寄せいただけると幸いです。
>
{style="warning"}

`@JsStatic`アノテーションは、ターゲット宣言に追加の静的メソッドを生成するようコンパイラに指示します。
これにより、Kotlinコードの静的メンバーをJavaScriptから直接使用するのに役立ちます。

`@JsStatic`アノテーションは、名前付きオブジェクトで定義された関数、およびクラスやインターフェース内で宣言されたコンパニオンオブジェクト内の関数に適用できます。このアノテーションを使用すると、コンパイラはオブジェクトの静的メソッドと、オブジェクト自体のインスタンスメソッドの両方を生成します。例：

```kotlin
// Kotlin
class C {
    companion object {
        @JsStatic
        fun callStatic() {}
        fun callNonStatic() {}
    }
}
```

これで、`callStatic()`関数はJavaScriptで静的になりますが、`callNonStatic()`関数は静的ではありません：

```javascript
// JavaScript
C.callStatic();              // Works, accessing the static function
C.callNonStatic();           // Error, not a static function in the generated JavaScript
C.Companion.callStatic();    // Instance method remains
C.Companion.callNonStatic(); // The only way it works
```

`@JsStatic`アノテーションをオブジェクトまたはコンパニオンオブジェクトのプロパティに適用することも可能で、そのゲッターおよびセッターメソッドがそのオブジェクトまたはコンパニオンオブジェクトを含むクラスの静的メンバーになります。

## JavaScriptにおけるKotlinの型

Kotlinの型がJavaScriptの型にどのようにマッピングされるかをご覧ください：

| Kotlin                                                                      | JavaScript                 | コメント                                                                                  |
|-----------------------------------------------------------------------------|----------------------------|-------------------------------------------------------------------------------------------|
| `Byte`, `Short`, `Int`, `Float`, `Double`                                   | `Number`                   |                                                                                           |
| `Char`                                                                      | `Number`                   | 数値は文字のコードを表します。                                               |
| `Long`                                                                      | Not supported              | JavaScriptには64ビット整数型がないため、Kotlinクラスによってエミュレートされます。 |
| `Boolean`                                                                   | `Boolean`                  |                                                                                           |
| `String`                                                                    | `String`                   |                                                                                           |
| `Array`                                                                     | `Array`                    |                                                                                           |
| `ByteArray`                                                                 | `Int8Array`                |                                                                                           |
| `ShortArray`                                                                | `Int16Array`               |                                                                                           |
| `IntArray`                                                                  | `Int32Array`               |                                                                                           |
| `CharArray`                                                                 | `UInt16Array`              | プロパティ `$type$ == "CharArray"` を持ちます。                                             |
| `FloatArray`                                                                | `Float32Array`             |                                                                                           |
| `DoubleArray`                                                               | `Float64Array`             |                                                                                           |
| `LongArray`                                                                 | `Array<kotlin.Long>`       | プロパティ `$type$ == "LongArray"` を持ちます。Kotlinの `Long` 型のコメントも参照してください。        |
| `BooleanArray`                                                              | `Int8Array`                | プロパティ `$type$ == "BooleanArray"` を持ちます。                                          |
| `List`, `MutableList`                                                       | `KtList`, `KtMutableList`  | `KtList.asJsReadonlyArrayView` または `KtMutableList.asJsArrayView` を介して `Array` を公開します。   |
| `Map`, `MutableMap`                                                         | `KtMap`, `KtMutableMap`    | `KtMap.asJsReadonlyMapView` または `KtMutableMap.asJsMapView` を介して ES2015 `Map` を公開します。    |
| `Set`, `MutableSet`                                                         | `KtSet`, `KtMutableSet`    | `KtSet.asJsReadonlySetView` または `KtMutableSet.asJsSetView` を介して ES2015 `Set` を公開します。    |
| `Unit`                                                                      | Undefined                  | 戻り値の型として使用する場合はエクスポート可能ですが、パラメーターの型として使用する場合はエクスポートできません。                 |
| `Any`                                                                       | `Object`                   |                                                                                           |
| `Throwable`                                                                 | `Error`                    |                                                                                           |
| Nullable `Type?`                                                            | `Type | null | undefined`  |                                                                                            |
| その他のすべてのKotlin型（`JsExport`アノテーションが付けられたものを除く） | Not supported              | Kotlinの[符号なし整数型](unsigned-integer-types.md)を含みます。                    |

さらに、以下のことを知っておくことが重要です：

* Kotlinは`kotlin.Int`、`kotlin.Byte`、`kotlin.Short`、`kotlin.Char`、`kotlin.Long`のオーバーフローセマンティクスを保持します。
* Kotlinは実行時に数値型を区別できません（`kotlin.Long`を除く）。そのため、次のコードは動作します：
  
  ```kotlin
  fun f() {
      val x: Int = 23
      val y: Any = x
      println(y as Float)
  }
  ```

* KotlinはJavaScriptで遅延オブジェクト初期化を保持します。
* KotlinはJavaScriptでトップレベルプロパティの遅延初期化を実装しません。