---
title: 可視性修飾子
---
クラス、オブジェクト、インターフェース、コンストラクタ、および関数は、プロパティとそのセッターと同様に、*visibility modifiers*（可視性修飾子）を持つことができます。
ゲッターは常に、そのプロパティと同じ可視性を持ちます。

Kotlin には、`private`、`protected`、`internal`、`public` の 4 つの可視性修飾子があります。
デフォルトの可視性は `public` です。

このページでは、これらの修飾子がさまざまな型の宣言スコープにどのように適用されるかを学びます。

## パッケージ

関数、プロパティ、クラス、オブジェクト、およびインターフェースは、パッケージ内の "トップレベル" で直接宣言できます。

```kotlin
// file name: example.kt
package foo

fun baz() { ... }
class Bar { ... }
```

* 可視性修飾子を使用しない場合、デフォルトで `public` が使用されます。これは、宣言がどこからでも見えることを意味します。
* 宣言を `private` としてマークすると、その宣言を含むファイル内でのみ表示されます。
* `internal` としてマークすると、同じ[モジュール](#modules)内のどこからでも表示されます。
* `protected` 修飾子は、トップレベルの宣言では使用できません。

:::note
別のパッケージから可視のトップレベル宣言を使用するには、それを[import](packages#imports)する必要があります。

:::

例：

```kotlin
// file name: example.kt
package foo

private fun foo() { ... } // visible inside example.kt

public var bar: Int = 5 // property is visible everywhere
    private set         // setter is visible only in example.kt
    
internal val baz = 6    // visible inside the same module
```

## クラスメンバー

クラス内で宣言されたメンバーの場合：

* `private` は、メンバーがこのクラス内でのみ（すべてのメンバーを含む）可視であることを意味します。
* `protected` は、メンバーが `private` としてマークされたものと同じ可視性を持つが、サブクラスでも可視であることを意味します。
* `internal` は、*このモジュール内*の、宣言クラスを参照するすべてのクライアントが、その `internal` メンバーを参照することを意味します。
* `public` は、宣言クラスを参照するすべてのクライアントが、その `public` メンバーを参照することを意味します。

:::note
Kotlin では、外側のクラスは内側のクラスの private メンバーを参照できません。

:::

`protected` または `internal` メンバーをオーバーライドし、可視性を明示的に指定しない場合、オーバーライドするメンバーも元のメンバーと同じ可視性を持ちます。

例：

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

クラスのプライマリコンストラクタの可視性を指定するには、次の構文を使用します。

:::note
明示的な `constructor` キーワードを追加する必要があります。

:::

```kotlin
class C private constructor(a: Int) { ... }
```

ここでは、コンストラクタは `private` です。デフォルトでは、すべてのコンストラクタは `public` であり、これは事実上、クラスが表示されるすべての場所でコンストラクタが表示されることを意味します（これは、`internal` クラスのコンストラクタは、同じモジュール内でのみ表示されることを意味します）。

sealed classes の場合、コンストラクタはデフォルトで `protected` になります。詳細については、[Sealed classes](sealed-classes#constructors)を参照してください。

### ローカル宣言

ローカル変数、関数、およびクラスは、可視性修飾子を持つことができません。

## モジュール

`internal` 可視性修飾子は、メンバーが同じモジュール内で可視であることを意味します。より具体的には、モジュールは、一緒にコンパイルされた Kotlin ファイルのセットです。例：

* IntelliJ IDEA モジュール。
* Maven プロジェクト。
* Gradle ソースセット（ただし、`test` ソースセットは `main` の internal 宣言にアクセスできるという例外があります）。
* 1 回の `<kotlinc>` Ant タスクの呼び出しでコンパイルされたファイルのセット。