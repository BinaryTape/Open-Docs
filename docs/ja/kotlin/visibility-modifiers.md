[//]: # (title: 可視性修飾子)

クラス、オブジェクト、インターフェース、コンストラクタ、関数、およびプロパティとそのセッターには、*可視性修飾子*を付けることができます。
ゲッターは常にプロパティと同じ可視性を持ちます。

Kotlin には、`private`、`protected`、`internal`、`public` の 4 つの可視性修飾子があります。
デフォルトの可視性は `public` です。

このページでは、修飾子が異なるタイプの宣言スコープにどのように適用されるかを学びます。

## パッケージ

関数、プロパティ、クラス、オブジェクト、およびインターフェースは、パッケージ内の直下、つまり「トップレベル」で宣言できます。

```kotlin
// ファイル名: example.kt
package foo

fun baz() { ... }
class Bar { ... }
```

* 可視性修飾子を使用しない場合、デフォルトで `public` が使用されます。これは、あなたの宣言がどこからでも参照可能であることを意味します。
* 宣言を `private` に指定すると、その宣言を含むファイル内でのみ参照可能になります。
* `internal` に指定すると、同じ[モジュール](#modules)内のどこからでも参照可能になります。
* `protected` 修飾子は、トップレベルの宣言では使用できません。

>別のパッケージから参照可能なトップレベルの宣言を使用するには、それを[インポート](packages.md#imports)する必要があります。
>
{style="note"}

例:

```kotlin
// ファイル名: example.kt
package foo

private fun foo() { ... } // example.kt 内で参照可能

public var bar: Int = 5 // プロパティはどこからでも参照可能
    private set         // セッターは example.kt 内でのみ参照可能
    
internal val baz = 6    // 同じモジュール内で参照可能
```

## クラスのメンバ

クラス内で宣言されたメンバの場合：

* `private` は、そのメンバがこのクラス内（すべてのメンバを含む）でのみ参照可能であることを意味します。
* `protected` は、`private` と同様の可視性に加えて、サブクラスでも参照可能であることを意味します。
* `internal` は、宣言しているクラスが見える*このモジュール内*のすべてのクライアントが、その `internal` メンバを参照できることを意味します。
* `public` は、宣言しているクラスが見えるすべてのクライアントが、その `public` メンバを参照できることを意味します。

> Kotlin では、外部クラスは内部クラス（inner classes）の private メンバを参照できません。
>
{style="note"}

`protected` または `internal` メンバをオーバーライドし、可視性を明示的に指定しない場合、オーバーライドしたメンバも元のメンバと同じ可視性を持ちます。

例:

```kotlin
open class Outer {
    private val a = 1
    protected open val b = 2
    internal open val c = 3
    val d = 4  // デフォルトで public
    
    protected class Nested {
        public val e: Int = 5
    }
}

class Subclass : Outer() {
    // a は参照不可
    // b, c, d は参照可能
    // Nested と e は参照可能

    override val b = 5   // 'b' は protected
    override val c = 7   // 'c' は internal
}

class Unrelated(o: Outer) {
    // o.a, o.b は参照不可
    // o.c と o.d は参照可能 (同じモジュール)
    // Outer.Nested は参照不可、Nested::e も参照不可
}
```

### コンストラクタ

クラスのプライマリコンストラクタの可視性を指定するには、次の構文を使用します。

> 明示的に `constructor` キーワードを追加する必要があります。
>
{style="note"}

```kotlin
class C private constructor(a: Int) { ... }
```

ここでは、コンストラクタは `private` です。デフォルトでは、すべてのコンストラクタが `public` であり、これは実質的にクラスが参照可能な場所であればどこでもコンストラクタが参照可能であることを意味します（つまり、`internal` クラスのコンストラクタは同じモジュール内でのみ参照可能です）。

シールドクラス（Sealed classes）の場合、コンストラクタはデフォルトで `protected` です。詳細は [シールドクラス](sealed-classes.md#constructors) を参照してください。

### ローカル宣言

ローカル変数、ローカル関数、およびローカルクラスには可視性修飾子を付けることができません。

## モジュール

`internal` 可視性修飾子は、メンバが同じモジュール内でのみ参照可能であることを意味します。より具体的には、モジュールとは一緒にコンパイルされる一連の Kotlin ファイルのセットを指します。例えば：

* IntelliJ IDEA モジュール。
* Maven プロジェクト。
* Gradle ソースセット（ただし、`test` ソースセットは `main` の internal 宣言にアクセスできるという例外があります）。