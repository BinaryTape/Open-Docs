[//]: # (title: JavaScriptからKotlinコードを使用する)

選択された[JavaScriptモジュール](js-modules.md)システムに応じて、Kotlin/JSコンパイラは異なる出力を生成します。
しかし一般的に、Kotlinコンパイラは通常のJavaScriptクラス、関数、プロパティを生成し、これらはJavaScriptコードから自由に
使用できます。ただし、覚えておくべきいくつかの微妙な点があります。

## plainモードで宣言を個別のJavaScriptオブジェクトに分離する

モジュール種別を`plain`に明示的に設定している場合、Kotlinは現在のモジュールからのすべてのKotlin宣言を含むオブジェクトを作成します。
これは、グローバルオブジェクトを汚染するのを防ぐために行われます。これにより、`myModule`というモジュールの場合、
すべての宣言が`myModule`オブジェクトを介してJavaScriptから利用可能になります。例:

```kotlin
fun foo() = "Hello"
```

この関数はJavaScriptから次のように呼び出すことができます。

```javascript
alert(myModule.foo());
```

この方法で関数を直接呼び出すことは、Kotlinモジュールを[UMD](https://github.com/umdjs/umd) ( `browser`と`nodejs`ターゲットの両方のデフォルト設定)、[ESM](https://tc39.es/ecma262/#sec-modules)、[CommonJS](https://nodejs.org/api/modules.html#modules-commonjs-modules)、または[AMD](https://github.com/amdjs/amdjs-api/wiki/AMD)のようなJavaScriptモジュールにコンパイルする場合には適用できません。
これらの場合、宣言は選択されたJavaScriptモジュールシステムに従って公開されます。
例えば、UMD、ESM、またはCommonJSを使用する場合、呼び出し箇所は次のようになります。

```javascript
alert(require('myModule').foo());
```

JavaScriptモジュールシステムの詳細については、[JavaScript Modules](js-modules.md)を参照してください。

## パッケージ構造

ほとんどのモジュールシステム（CommonJS、Plain、UMD）では、Kotlinはそのパッケージ構造をJavaScriptに公開します。
ルートパッケージで宣言を定義しない限り、JavaScriptでは完全修飾名を使用する必要があります。
例:

```kotlin
package my.qualified.packagename

fun foo() = "Hello"
```

例えば、UMDまたはCommonJSを使用する場合、呼び出し箇所は次のようになります。

```javascript
alert(require('myModule').my.qualified.packagename.foo())
```

モジュールシステム設定として`plain`を使用する場合、呼び出し箇所は次のようになります。

```javascript
alert(myModule.my.qualified.packagename.foo());
```

ECMAScript Modules (ESM) をターゲットとする場合、アプリケーションのバンドルサイズを改善し、ESMパッケージの典型的なレイアウトに合わせるために、パッケージ情報は保持されません。
この場合、ESモジュールでのKotlin宣言の利用は次のようになります。

```javascript
import { foo } from 'myModule';

alert(foo());
```

### @JsNameアノテーション

一部のケース（例えば、オーバーロードをサポートするため）では、Kotlinコンパイラは生成された関数名と属性名を
JavaScriptコードでマングリングします。生成される名前を制御するには、`@JsName`アノテーションを使用できます。

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

これで、このクラスをJavaScriptから次のように使用できます。

```javascript
// If necessary, import 'kjs' according to chosen module system
var person = new kjs.Person("Dmitry");   // refers to module 'kjs'
person.hello();                          // prints "Hello Dmitry!"
person.helloWithGreeting("Servus");      // prints "Servus Dmitry!"
```

`@JsName`アノテーションを指定しなかった場合、対応する関数の名前には、関数シグネチャから計算されたサフィックス（例: `hello_61zpoe`）が含まれます。

なお、Kotlinコンパイラがマングリングを適用しない場合がいくつかあります。
- `external`宣言はマングリングされません。
- `external`クラスから継承した非`external`クラス内のオーバーライドされた関数はマングリングされません。

`@JsName`のパラメーターは、有効な識別子である定数文字列リテラルである必要があります。
コンパイラは、有効な識別子ではない文字列を`@JsName`に渡そうとするとエラーを報告します。
次の例はコンパイル時エラーを生成します。

```kotlin
@JsName("new C()")   // error here
external fun newC()
```

### @JsExportアノテーション

> この機能は[実験的](components-stability.md#stability-levels-explained)です。
> その設計は将来のバージョンで変更される可能性があります。
>
{style="warning"} 

トップレベル宣言（クラスや関数など）に`@JsExport`アノテーションを適用することで、Kotlin宣言をJavaScriptから利用可能にします。
このアノテーションは、Kotlinで指定された名前でネストされたすべての宣言をエクスポートします。
`@file:JsExport`を使用してファイルレベルで適用することもできます。

エクスポートにおける曖昧さを解消するために（同名の関数のオーバーロードなど）、`@JsExport`アノテーションを`@JsName`と組み合わせて使用し、生成およびエクスポートされる関数の名前を指定できます。

現在、`@JsExport`アノテーションは、関数をKotlinから可視にする唯一の方法です。

マルチプラットフォームプロジェクトでは、`@JsExport`は共通コードでも利用可能です。
これはJavaScriptターゲット向けにコンパイルする場合にのみ効果があり、プラットフォーム固有ではないKotlin宣言もエクスポートできます。

### @JsStatic

> この機能は[実験的](components-stability.md#stability-levels-explained)です。いつでも廃止または変更される可能性があります。
> 評価目的でのみ使用してください。これに関するフィードバックを[YouTrack](https://youtrack.jetbrains.com/issue/KT-18891/JS-provide-a-way-to-declare-static-members-JsStatic)にていただけると幸いです。
>
{style="warning"}

`@JsStatic`アノテーションは、ターゲット宣言に対して追加の静的メソッドを生成するようにコンパイラに指示します。
これは、Kotlinコードの静的メンバーをJavaScriptで直接使用するのに役立ちます。

`@JsStatic`アノテーションは、名前付きオブジェクトで定義された関数、およびクラスやインターフェース内に宣言されたコンパニオンオブジェクトに適用できます。
このアノテーションを使用すると、コンパイラはオブジェクトの静的メソッドと、オブジェクト自体のインスタンスメソッドの両方を生成します。例:

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

ここで、`callStatic()`関数はJavaScriptでは静的ですが、`callNonStatic()`関数はそうではありません。

```javascript
// JavaScript
C.callStatic();              // Works, accessing the static function
C.callNonStatic();           // Error, not a static function in the generated JavaScript
C.Companion.callStatic();    // Instance method remains
C.Companion.callNonStatic(); // The only way it works
```

オブジェクトまたはコンパニオンオブジェクトのプロパティに`@JsStatic`アノテーションを適用することも可能です。
これにより、そのオブジェクト、またはコンパニオンオブジェクトを含むクラスにおいて、そのゲッターおよびセッターメソッドを静的メンバーにします。

### Kotlinの`Long`型を表現するための`BigInt`型の使用
<primary-label ref="experimental-general"/>

Kotlin/JSは、モダンJavaScript (ES2020) にコンパイルする際、Kotlinの`Long`値を表現するためにJavaScriptの組み込み`BigInt`型を使用します。

`BigInt`型へのサポートを有効にするには、次のコンパイラオプションを`build.gradle(.kts)`ファイルに追加する必要があります。

```kotlin
// build.gradle.kts
kotlin {
    js {
        ...
        compilerOptions {
            freeCompilerArgs.add("-Xes-long-as-bigint")
        }
    }
}
```

この機能は[実験的](components-stability.md#stability-levels-explained)です。フィードバックは課題トラッカー、
[YouTrack](https://youtrack.jetbrains.com/issue/KT-57128/KJS-Use-BigInt-to-represent-Long-values-in-ES6-mode)までお寄せください。

#### エクスポートされた宣言での`Long`の使用

Kotlinの`Long`型はJavaScriptの`BigInt`型にコンパイルできるため、Kotlin/JSは`Long`値をJavaScriptにエクスポートすることをサポートしています。

この機能を有効にするには:

1.  Kotlin/JSで`Long`のエクスポートを許可します。`build.gradle(.kts)`ファイルの`freeCompilerArgs`属性に次のコンパイラオプションを追加します:

 ```kotlin
// build.gradle.kts
kotlin {
    js {
        ...
        compilerOptions { 
            freeCompilerArgs.add("-XXLanguage:+JsAllowLongInExportedDeclarations")
        }
    }
}
```

2.  `BigInt`型を有効にします。有効にする方法については、[Kotlinの`Long`型を表現するための`BigInt`型の使用](#use-bigint-type-to-represent-kotlin-s-long-type)を参照してください。

## JavaScriptにおけるKotlinの型

Kotlinの型がJavaScriptの型にどのようにマッピングされるかを参照してください:

| Kotlin                                                           | JavaScript                | コメント                                                                              |
|------------------------------------------------------------------|---------------------------|---------------------------------------------------------------------------------------|
| `Byte`, `Short`, `Int`, `Float`, `Double`                        | `Number`                  |                                                                                       |
| `Char`                                                           | `Number`                  | 数値は文字コードを表します。                                                          |
| `Long`                                                           | `BigInt`                  | [`-Xes-long-as-bigint`コンパイラオプション](compiler-reference.md#xes-long-as-bigint)の設定が必要です。 |
| `Boolean`                                                        | `Boolean`                 |                                                                                       |
| `String`                                                         | `String`                  |                                                                                       |
| `Array`                                                          | `Array`                   |                                                                                       |
| `ByteArray`                                                      | `Int8Array`               |                                                                                       |
| `ShortArray`                                                     | `Int16Array`              |                                                                                       |
| `IntArray`                                                       | `Int32Array`              |                                                                                       |
| `CharArray`                                                      | `UInt16Array`             | `$type$ == "CharArray"`プロパティを持ちます。                                         |
| `FloatArray`                                                     | `Float32Array`            |                                                                                       |
| `DoubleArray`                                                    | `Float64Array`            |                                                                                       |
| `LongArray`                                                      | `Array<kotlin.Long>`      | `$type$ == "LongArray"`プロパティを持ちます。KotlinのLong型に関するコメントも参照してください。    |
| `BooleanArray`                                                   | `Int8Array`               | `$type$ == "BooleanArray"`プロパティを持ちます。                                      |
| `List`, `MutableList`                                            | `KtList`, `KtMutableList` | `KtList.asJsReadonlyArrayView`または`KtMutableList.asJsArrayView`を介して`Array`を公開します。 |
| `Map`, `MutableMap`                                              | `KtMap`, `KtMutableMap`   | `KtMap.asJsReadonlyMapView`または`KtMutableMap.asJsMapView`を介してES2015の`Map`を公開します。 |
| `Set`, `MutableSet`                                              | `KtSet`, `KtMutableSet`   | `KtSet.asJsReadonlySetView`または`KtMutableSet.asJsSetView`を介してES2015の`Set`を公開します。 |
| `Unit`                                                           | Undefined                 | 戻り値の型として使用する場合はエクスポート可能ですが、パラメーターの型として使用する場合はエクスポートできません。 |
| `Any`                                                            | `Object`                  |                                                                                       |
| `Throwable`                                                      | `Error`                   |                                                                                       |
| `enum class Type`                                                | `Type`                    | 列挙型エントリは静的クラスプロパティ（`Type.ENTRY`）として公開されます。                   |
| Nullable `Type?`                                                 | `Type                     | null                                                                                  | undefined` |                                                                                            |
| `@JsExport`でマークされたものを除くその他すべてのKotlin型 | Not supported             | Kotlinの[符号なし整数型](unsigned-integer-types.md)が含まれます。                |

さらに、次の点を知っておくことが重要です。

*   Kotlinは`kotlin.Int`、`kotlin.Byte`、`kotlin.Short`、`kotlin.Char`、`kotlin.Long`のオーバーフローセマンティクスを保持します。
*   Kotlinは実行時に数値型を区別できません（`kotlin.Long`を除く）。そのため、次のコードが機能します。
  
  ```kotlin
  fun f() {
      val x: Int = 23
      val y: Any = x
      println(y as Float)
  }
  ```

*   KotlinはJavaScriptで遅延オブジェクト初期化を保持します。