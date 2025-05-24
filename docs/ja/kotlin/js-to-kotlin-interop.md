---
title: JavaScriptからKotlinコードを使用する
---
選択された [JavaScript Module](js-modules) システムに応じて、Kotlin/JS コンパイラーは異なる出力を生成します。
しかし一般的に、Kotlin コンパイラーは通常の JavaScript のクラス、関数、プロパティを生成し、それらは JavaScript コードから自由に使用できます。ただし、いくつか覚えておくべき微妙な点があります。

## プレーンモードで、宣言を分離された JavaScript オブジェクトに格納する

モジュール種別を明示的に `plain` に設定した場合、Kotlin は現在のモジュールからすべての Kotlin 宣言を含むオブジェクトを作成します。これはグローバルオブジェクトを汚染するのを防ぐためです。つまり、モジュール `myModule` の場合、すべての宣言は `myModule` オブジェクトを介して JavaScript で利用できます。例：

```kotlin
fun foo() = "Hello"
```

これは、JavaScript から次のように呼び出すことができます。

```javascript
alert(myModule.foo());
```

これは、Kotlin モジュールを UMD ( `browser` と `nodejs` ターゲットの両方のデフォルト設定) 、CommonJS 、または AMD のような JavaScript モジュールにコンパイルする場合は該当しません。この場合、宣言は選択した JavaScript モジュールシステムで指定された形式で公開されます。たとえば、UMD または CommonJS を使用する場合、呼び出し箇所は次のようになります。

```javascript
alert(require('myModule').foo());
```

JavaScript モジュールシステムの詳細については、[JavaScript Modules](js-modules) に関する記事を参照してください。

## パッケージ構造

Kotlin はパッケージ構造を JavaScript に公開するため、ルートパッケージで宣言を定義しない限り、JavaScript で完全修飾名を使用する必要があります。例：

```kotlin
package my.qualified.packagename

fun foo() = "Hello"
```

たとえば、UMD または CommonJS を使用する場合、呼び出し箇所は次のようになります。

```javascript
alert(require('myModule').my.qualified.packagename.foo())
```

または、モジュールシステム設定として `plain` を使用する場合：

```javascript
alert(myModule.my.qualified.packagename.foo());
```

### @JsName アノテーション

場合によっては (たとえば、オーバーロードをサポートするため) 、Kotlin コンパイラーは生成された関数と属性の名前を JavaScript コード内でマングルします。生成される名前を制御するには、`@JsName` アノテーションを使用します。

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

これで、このクラスを JavaScript から次の方法で使用できます。

```javascript
// If necessary, import 'kjs' according to chosen module system
var person = new kjs.Person("Dmitry");   // refers to module 'kjs'
person.hello();                          // prints "Hello Dmitry!"
person.helloWithGreeting("Servus");      // prints "Servus Dmitry!"
```

`@JsName` アノテーションを指定しなかった場合、対応する関数の名前には、関数シグネチャから計算されたサフィックス (例えば `hello_61zpoe`) が含まれます。

Kotlin コンパイラーがマングルを適用しないケースがいくつかあることに注意してください。
- `external` 宣言はマングルされません。
- `external` クラスから継承された非 `external` クラス内のオーバーライドされた関数はマングルされません。

`@JsName` のパラメーターは、有効な識別子である定数文字列リテラルである必要があります。
コンパイラーは、識別子以外の文字列を `@JsName` に渡そうとするとエラーを報告します。
次の例は、コンパイル時エラーを生成します。

```kotlin
@JsName("new C()")   // error here
external fun newC()
```

### @JsExport アノテーション

:::caution
この機能は [Experimental](components-stability#stability-levels-explained) です。
その設計は将来のバージョンで変更される可能性があります。

::: 

`@JsExport` アノテーションをトップレベルの宣言 (クラスや関数など) に適用すると、Kotlin の宣言を JavaScript から利用できるようになります。このアノテーションは、Kotlin で指定された名前を持つすべてのネストされた宣言をエクスポートします。`@file:JsExport` を使用してファイルレベルで適用することもできます。

エクスポートの曖昧さを解決するために (同じ名前の関数のオーバーロードなど) 、`@JsExport` アノテーションを `@JsName` と組み合わせて使用して、生成およびエクスポートされる関数の名前を指定できます。

現在の [IR compiler backend](js-ir-compiler) では、`@JsExport` アノテーションは関数を Kotlin から表示できるようにする唯一の方法です。

マルチプラットフォームプロジェクトの場合、`@JsExport` は共通コードでも利用できます。これは JavaScript ターゲット用にコンパイルする場合にのみ有効であり、プラットフォーム固有ではない Kotlin 宣言をエクスポートすることもできます。

### @JsStatic

:::caution
この機能は [Experimental](components-stability#stability-levels-explained) です。いつでも削除または変更される可能性があります。評価目的でのみ使用してください。 [YouTrack](https://youtrack.jetbrains.com/issue/KT-18891/JS-provide-a-way-to-declare-static-members-JsStatic) でフィードバックをお寄せいただければ幸いです。

:::

`@JsStatic` アノテーションは、ターゲット宣言に追加の static メソッドを生成するようにコンパイラーに指示します。
これにより、Kotlin コードの static メンバーを JavaScript で直接使用できるようになります。

`@JsStatic` アノテーションは、名前付きオブジェクトで定義された関数、およびクラスとインターフェイス内で宣言されたコンパニオンオブジェクトに適用できます。このアノテーションを使用すると、コンパイラーはオブジェクトの static メソッドとオブジェクト自体のインスタンスメソッドの両方を生成します。例：

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

これで、`callStatic()` 関数は JavaScript で static になり、`callNonStatic()` 関数は static になりません。

```javascript
// JavaScript
C.callStatic();              // Works, accessing the static function
C.callNonStatic();           // Error, not a static function in the generated JavaScript
C.Companion.callStatic();    // Instance method remains
C.Companion.callNonStatic(); // The only way it works
```

オブジェクトまたはコンパニオンオブジェクトのプロパティに `@JsStatic` アノテーションを適用して、そのゲッターとセッターメソッドをそのオブジェクトまたはコンパニオンオブジェクトを含むクラスの static メンバーにすることもできます。

## JavaScript における Kotlin の型

Kotlin の型が JavaScript の型にどのようにマッピングされるかを確認してください。

| Kotlin                                                                      | JavaScript                 | コメント                                                                                  |
|-----------------------------------------------------------------------------|----------------------------|-------------------------------------------------------------------------------------------|
| `Byte`, `Short`, `Int`, `Float`, `Double`                                   | `Number`                   |                                                                                           |
| `Char`                                                                      | `Number`                   | 数値は文字のコードを表します。                                                                 |
| `Long`                                                                      | サポートされていません             | JavaScript には 64 ビット整数型がないため、Kotlin クラスによってエミュレートされます。                                |
| `Boolean`                                                                   | `Boolean`                  |                                                                                           |
| `String`                                                                    | `String`                   |                                                                                           |
| `Array`                                                                     | `Array`                    |                                                                                           |
| `ByteArray`                                                                 | `Int8Array`                |                                                                                           |
| `ShortArray`                                                                | `Int16Array`               |                                                                                           |
| `IntArray`                                                                  | `Int32Array`               |                                                                                           |
| `CharArray`                                                                | `UInt16Array`              | プロパティ `$type$ == "CharArray"` を持ちます。                                             |
| `FloatArray`                                                                | `Float32Array`             |                                                                                           |
| `DoubleArray`                                                               | `Float64Array`             |                                                                                           |
| `LongArray`                                                                 | `Array<kotlin.Long>`       | プロパティ `$type$ == "LongArray"` を持ちます。 Kotlin の Long 型のコメントも参照してください。        |
| `BooleanArray`                                                              | `Int8Array`                | プロパティ `$type$ == "BooleanArray"` を持ちます。                                          |
| `List`, `MutableList`                                                       | `KtList`, `KtMutableList`  | `KtList.asJsReadonlyArrayView` または `KtMutableList.asJsArrayView` を介して `Array` を公開します。   |
| `Map`, `MutableMap`                                                         | `KtMap`, `KtMutableMap`    | `KtMap.asJsReadonlyMapView` または `KtMutableMap.asJsMapView` を介して ES2015 `Map` を公開します。    |
| `Set`, `MutableSet`                                                         | `KtSet`, `KtMutableSet`    | `KtSet.asJsReadonlySetView` または `KtMutableSet.asJsSetView` を介して ES2015 `Set` を公開します。    |
| `Unit`                                                                      | Undefined                  | 戻り値の型として使用する場合はエクスポート可能ですが、パラメーター型として使用する場合はエクスポートできません。                 |
| `Any`                                                                       | `Object`                   |                                                                                           |
| `Throwable`                                                                 | `Error`                    |                                                                                           |
| Nullable `Type?`                                                            | `Type | null | undefined`  |                                                                                            |
| 他のすべての Kotlin の型 (`JsExport` アノテーションが付いているものを除く) | サポートされていません              | Kotlin の [符号なし整数型](unsigned-integer-types) が含まれます。                    |

さらに、次のことを知っておくことが重要です。

* Kotlin は、`kotlin.Int`、`kotlin.Byte`、`kotlin.Short`、`kotlin.Char`、および `kotlin.Long` のオーバーフローセマンティクスを保持します。
* Kotlin は実行時に数値型を区別できません ( `kotlin.Long` を除く) 。したがって、次のコードは機能します。
  
  ```kotlin
  fun f() {
      val x: Int = 23
      val y: Any = x
      println(y as Float)
  }
  ```

* Kotlin は、JavaScript での遅延オブジェクトの初期化を保持します。
* Kotlin は、JavaScript でのトップレベルプロパティの遅延初期化を実装しません。
  ```