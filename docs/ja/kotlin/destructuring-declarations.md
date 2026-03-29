[//]: # (title: 分解宣言)

オブジェクトを複数の変数に*分解*できると便利なことがあります。例えば：

```kotlin
val (name, age) = person 
```

この構文は*分解宣言 (destructuring declaration)* と呼ばれます。分解宣言は、複数の変数を一度に作成します。
ここでは2つの新しい変数、`name` と `age` を宣言しており、これらを独立して使用できます：

 ```kotlin
println(name)
println(age)
```

分解宣言は、以下のようなコードにコンパイルされます：

```kotlin
val name = person.component1()
val age = person.component2()
```

`component1()` と `component2()` 関数は、Kotlinで広く使用されている*慣習 (conventions) の原則*のもう一つの例です（`+` や `*` などの演算子、`for` ループなどがその例です）。
必要な数のコンポーネント関数を呼び出せるのであれば、分解宣言の右辺にはどのようなオブジェクトでも置くことができます。そして、もちろん `component3()` や `component4()` などと続けることも可能です。

> `componentN()` 関数を分解宣言で使用できるようにするには、`operator` キーワードを付ける必要があります。
>
{style="note"}

分解宣言は `for` ループ内でも機能します：

```kotlin
for ((a, b) in collection) { ... }
```

変数 `a` と `b` には、コレクションの要素に対して呼び出された `component1()` と `component2()` が返す値が代入されます。

## 例：関数から2つの値を返す
 
関数から2つのもの（例えば、結果オブジェクトと何らかのステータス）を返す必要があるとします。
Kotlinでこれを簡潔に行う方法は、[データクラス](data-classes.md)を宣言してそのインスタンスを返すことです：

```kotlin
data class Result(val result: Int, val status: Status)
fun function(...): Result {
    // 計算処理
    
    return Result(result, status)
}

// この関数を使用する場合：
val (result, status) = function(...)
```

データクラスは `componentN()` 関数を自動的に宣言するため、ここでは分解宣言が機能します。

> 標準クラスの `Pair` を使用して `function()` が `Pair<Int, Status>` を返すようにすることもできますが、多くの場合、データには適切に名前を付けた方が良いでしょう。
>
{style="note"}

## 例：分解宣言とマップ

マップを反復処理する際、おそらく最も洗練された方法がこちらです：

```kotlin
for ((key, value) in map) {
   // key と value を使って何かを行う
}
```

これを動作させるためには、以下の条件を満たす必要があります：

* `iterator()` 関数を提供することで、マップを値のシーケンスとして表現する。
* `component1()` および `component2()` 関数を提供することで、各要素をペアとして表現する。
  
実際、標準ライブラリは以下のような拡張を提供しています：

```kotlin
operator fun <K, V> Map<K, V>.iterator(): Iterator<Map.Entry<K, V>> = entrySet().iterator()
operator fun <K, V> Map.Entry<K, V>.component1() = getKey()
operator fun <K, V> Map.Entry<K, V>.component2() = getValue()
```

そのため、マップ（およびデータクラスのインスタンスのコレクションなど）に対して、`for` ループ内で自由に分解宣言を使用できます。

## 未使用の変数に対するアンダースコア

分解宣言で変数が必要ない場合は、名前の代わりにアンダースコアを置くことができます：

```kotlin
val (_, status) = getResult()
```

このようにスキップされたコンポーネントについては、`componentN()` オペレーター関数は呼び出されません。

## ラムダでの分解

ラムダのパラメータに対して分解宣言の構文を使用できます。
ラムダが `Pair` 型（または `Map.Entry` や、適切な `componentN` 関数を持つその他の型）のパラメータを持つ場合、それらを括弧で囲むことで、1つのパラメータの代わりに複数の新しいパラメータを導入できます：

```kotlin
map.mapValues { entry -> "${entry.value}!" }
map.mapValues { (key, value) -> "$value!" }
```

2つのパラメータを宣言する場合と、1つのパラメータの代わりに分解されたペアを宣言する場合の違いに注意してください：

```kotlin
{ a -> ... } // 1つのパラメータ
{ a, b -> ... } // 2つのパラメータ
{ (a, b) -> ... } // 分解されたペア
{ (a, b), c -> ... } // 分解されたペアと別のパラメータ
```

分解されたパラメータのコンポーネントが使用されない場合は、名前を考える手間を省くためにアンダースコアに置き換えることができます：

```kotlin
map.mapValues { (_, value) -> "$value!" }
```

分解されたパラメータ全体、または特定のコンポーネントに対して個別に型を指定することもできます：

```kotlin
map.mapValues { (_, value): Map.Entry<Int, String> -> "$value!" }

map.mapValues { (_, value: String) -> "$value!" }
```

## 名前ベースの分解宣言
<primary-label ref="experimental-opt-in"/>

Kotlinは*名前ベースの分解宣言 (name-based destructuring declarations)* をサポートしています。
これは、*位置ベースの (position-based)* 分解における `componentN()` 関数で定義された位置ではなく、名前によって変数をプロパティに一致させるものです。

> 名前ベースの分解に関する詳細は、この機能の [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0438-name-based-destructuring.md) を参照してください。
>
{style="tip"}

位置ベースの分解では、変数は `componentN()` 関数の順序に対応します。例えば：

```kotlin
data class User(val username: String, val email: String)

fun main() {
    val user = User("alice", "alice@example.com")

    val (email, username) = user

    println(email)
    // alice

    println(username)
    // alice@example.com
}
```
{kotlin-runnable="true"}

この例では、分解が `componentN()` 関数の順序に依存しているため、`email` は `username` の値を、`username` は `email` の値を受け取ります。

名前ベースの分解を使用すると、`componentN()` 関数の位置ではなく、プロパティ名によってどの値が抽出されるかが決定されます：

```kotlin
fun main() {
    val user = User("alice", "alice@example.com")

    // 明示的な形式の名前ベースの分解を使用
    (val mail = email, val name = username) = user

    println(name)
    // alice

    println(mail)
    // alice@example.com
}
```

名前ベースの分解は [試験的 (Experimental)](components-stability.md#stability-levels-explained) です。
この機能を有効にすると、角括弧を使用した位置ベースの分解のための新しい構文も導入されます。
この構文は、リストやその他の順序付けられたコレクションなど、要素の順序が重要な型や、`Pair` や `Triple` のような名前のないタプルに使用してください：

```kotlin
val point = Pair(10, 20)

// 位置ベースの分解を使用
val [x, y] = point
```

コンパイラが分解宣言をどのように解釈するかは、`-Xname-based-destructuring` コンパイラオプションで制御できます。

以下のモードがあります：

* `only-syntax` は、既存の分解宣言の振る舞いを変えることなく、名前ベースの分解の明示的な形式を有効にします。
* `name-mismatch` は、データクラスにおける位置ベースの分解で、プロパティ名と一致しない変数名が使用されている場合に警告を報告します。
* `complete` は、括弧を使用した短縮形式の名前ベースの分解を有効にし、角括弧構文による位置ベースの分解のサポートを継続します。

> `complete` モードを有効にする前に、`name-mismatch` モードで報告される警告を確認し、解決してください。
> これらの警告は、`complete` モードでコンパイラが異なる解釈をする分解宣言を示しており、それらを適切に書き換えるための提案が含まれています。
> 
{style="tip"}

`complete` モードを使用すると、括弧を使用した短縮形式の分解構文は、位置に依存するのではなく、変数をプロパティ名に一致させます：

```kotlin
val (email, username) = user
```

プロジェクトで名前ベースの分解を有効にするには、ビルド構成ファイルにコンパイラオプションを追加してください：

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xname-based-destructuring=only-syntax")
    }
}
```

</tab> 
<tab title="Maven" group-key="maven">

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <configuration>
                <args>
                    <arg>-Xname-based-destructuring=only-syntax</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</tab> 
</tabs>