[//]: # (title: 可視性修飾子)

クラス、オブジェクト、インターフェース、コンストラクタ、関数、さらにはプロパティとそのセッターは、*可視性修飾子*を持つことができます。
ゲッターは常にそのプロパティと同じ可視性を持ちます。

Kotlinには4つの可視性修飾子があります: `private`、`protected`、`internal`、`public`。
デフォルトの可視性は`public`です。

このページでは、修飾子が異なる種類の宣言スコープにどのように適用されるかについて説明します。

## パッケージ

関数、プロパティ、クラス、オブジェクト、インターフェースは、パッケージの直下で「トップレベル」に宣言できます。

```kotlin
// file name: example.kt
package foo

fun baz() { ... }
class Bar { ... }
```

*   可視性修飾子を使用しない場合、デフォルトで`public`が使用されます。これは、宣言がどこからでも可視になることを意味します。
*   宣言を`private`とマークした場合、その宣言を含むファイル内でのみ可視になります。
*   `internal`とマークした場合、同じ[モジュール](#modules)内のどこからでも可視になります。
*   `protected`修飾子は、トップレベルの宣言には利用できません。

>別のパッケージから可視なトップレベル宣言を使用するには、それを[インポート](packages.md#imports)する必要があります。
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

クラス内で宣言されたメンバーの場合:

*   `private`は、メンバーがこのクラス内でのみ可視であることを意味します（そのすべてのメンバーを含む）。
*   `protected`は、メンバーが`private`とマークされたものと同じ可視性を持つことを意味しますが、サブクラスからも可視です。
*   `internal`は、宣言しているクラスを見る*このモジュール内の*どのクライアントも、その`internal`メンバーを見ることができることを意味します。
*   `public`は、宣言しているクラスを見るどのクライアントも、その`public`メンバーを見ることができることを意味します。

>Kotlinでは、外側のクラスは内部クラスのプライベートメンバーを見ることができません。
>
{style="note"}

`protected`または`internal`メンバーをオーバーライドし、可視性を明示的に指定しない場合、オーバーライドするメンバーもオリジナルと同じ可視性を持つことになります。

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

クラスのプライマリコンストラクタの可視性を指定するには、以下の構文を使用します:

>明示的な`constructor`キーワードを追加する必要があります。
>
{style="note"}

```kotlin
class C private constructor(a: Int) { ... }
```

ここではコンストラクタは`private`です。デフォルトでは、すべてのコンストラクタは`public`であり、事実上、クラスが可視な場所ならどこからでも可視であることを意味します（これは、`internal`クラスのコンストラクタは同じモジュール内でのみ可視であることを意味します）。

シールドクラスの場合、コンストラクタはデフォルトで`protected`になります。詳細については、[シールドクラス](sealed-classes.md#constructors)を参照してください。

### ローカル宣言

ローカル変数、関数、クラスは可視性修飾子を持つことはできません。

## モジュール

`internal`可視性修飾子は、メンバーが同じモジュール内で可視であることを意味します。より具体的には、モジュールとは、まとめてコンパイルされるKotlinファイルのセットであり、例えば以下のものが挙げられます:

*   IntelliJ IDEA モジュール。
*   Maven プロジェクト。
*   Gradle ソースセット（ただし、`test`ソースセットが`main`の内部宣言にアクセスできるという例外があります）。
*   1回の呼び出しでコンパイルされた`<kotlinc>` Ant タスクのファイルのセット。