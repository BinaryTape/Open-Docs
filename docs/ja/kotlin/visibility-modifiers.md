[//]: # (title: 視認性修飾子)

クラス、オブジェクト、インターフェース、コンストラクタ、関数、およびプロパティとそのセッターは、*視認性修飾子*を持つことができます。
ゲッターは常に、対応するプロパティと同じ視認性を持ちます。

Kotlinには、`private`、`protected`、`internal`、`public`の4つの視認性修飾子があります。
デフォルトの視認性は`public`です。

このページでは、これらの修飾子が異なる種類の宣言スコープにどのように適用されるかを学びます。

## パッケージ

関数、プロパティ、クラス、オブジェクト、インターフェースは、パッケージ内に直接「トップレベル」で宣言できます。

```kotlin
// file name: example.kt
package foo

fun baz() { ... }
class Bar { ... }
```

* 視認性修飾子を使用しない場合、デフォルトで`public`が使用されます。これは、宣言がどこからでも見えることを意味します。
* 宣言を`private`とマークした場合、その宣言を含むファイル内でのみ可視になります。
* `internal`とマークした場合、同じ[モジュール](#modules)内のどこからでも可視になります。
* `protected`修飾子は、トップレベル宣言には使用できません。

>他のパッケージから可視なトップレベル宣言を使用するには、その宣言を[インポート](packages.md#imports)する必要があります。
>
{style="note"}

例:

```kotlin
// file name: example.kt
package foo

private fun foo() { ... } // visible inside example.kt

public var bar: Int = 5 // property is visible everywhere
    private set         // setter is visible only in example.kt
    
internal val baz = 6    // visible inside the same module
```

## クラスメンバー

クラス内で宣言されたメンバーについて:

* `private`は、そのメンバーがこのクラス内でのみ（そのすべてのメンバーを含め）可視であることを意味します。
* `protected`は、そのメンバーが`private`とマークされたものと同じ視認性を持つことを意味しますが、サブクラスからも可視です。
* `internal`は、宣言元のクラスを見ることができる*このモジュール内の*任意のクライアントが、その`internal`メンバーを見ることができることを意味します。
* `public`は、宣言元のクラスを見ることができる任意のクライアントが、その`public`メンバーを見ることができることを意味します。

>Kotlinでは、外側のクラスは内部クラスのプライベートメンバーを見ることができません。
>
{style="note"}

`protected`または`internal`メンバーをオーバーライドする際に、視認性を明示的に指定しない場合、オーバーライドするメンバーも元のメンバーと同じ視認性を持ちます。

例:

```kotlin
open class Outer {
    private val a = 1
    protected open val b = 2
    internal open val c = 3
    val d = 4  // public by default
    
    protected class Nested {
        public val e: Int = 5
    }
}

class Subclass : Outer() {
    // a is not visible
    // b, c and d are visible
    // Nested and e are visible

    override val b = 5   // 'b' is protected
    override val c = 7   // 'c' is internal
}

class Unrelated(o: Outer) {
    // o.a, o.b are not visible
    // o.c and o.d are visible (same module)
    // Outer.Nested is not visible, and Nested::e is not visible either 
}
```

### コンストラクタ

クラスのプライマリコンストラクタの視認性を指定するには、以下の構文を使用します。

>明示的に`constructor`キーワードを追加する必要があります。
>
{style="note"}

```kotlin
class C private constructor(a: Int) { ... }
```

ここでは、コンストラクタは`private`です。デフォルトでは、すべてのコンストラクタは`public`であり、事実上、クラスが可視であるどこからでも可視であることを意味します（これは、`internal`クラスのコンストラクタが同じモジュール内でのみ可視であることを意味します）。

シールドクラスの場合、コンストラクタはデフォルトで`protected`です。詳細については、[シールドクラス](sealed-classes.md#constructors)を参照してください。

### ローカル宣言

ローカル変数、関数、クラスは視認性修飾子を持つことができません。

## モジュール

`internal`視認性修飾子は、そのメンバーが同じモジュール内で可視であることを意味します。より具体的には、
モジュールとは、以下に示すように、まとめてコンパイルされるKotlinファイルのセットです。

* IntelliJ IDEAモジュール。
* Mavenプロジェクト。
* Gradleソースセット（ただし、`test`ソースセットは`main`の内部宣言にアクセスできるという例外があります）。
* `<kotlinc>` Antタスクの1回の呼び出しでコンパイルされるファイルのセット。