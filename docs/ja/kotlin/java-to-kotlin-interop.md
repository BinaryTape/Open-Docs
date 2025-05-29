[//]: # (title: JavaからKotlinを呼び出す)

KotlinコードはJavaから簡単に呼び出すことができます。
例えば、KotlinクラスのインスタンスはJavaメソッド内でシームレスに作成および操作できます。
しかし、KotlinコードをJavaに統合する際には、JavaとKotlinの間に注意すべきいくつかの違いがあります。
このページでは、KotlinコードとJavaクライアントとの相互運用性（interop）を調整する方法について説明します。

## プロパティ

Kotlinのプロパティは、以下のJava要素にコンパイルされます。

 * ゲッターメソッド（`get`プレフィックスを前に付けて名前が計算されます）
 * セッターメソッド（`set`プレフィックスを前に付けて名前が計算されます）（`var`プロパティのみ）
 * プライベートフィールド（プロパティ名と同じ名前）（バッキングフィールドを持つプロパティのみ）

例えば、`var firstName: String` は以下のJava宣言にコンパイルされます。

```java
private String firstName;

public String getFirstName() {
    return firstName;
}

public void setFirstName(String firstName) {
    this.firstName = firstName;
}
```

プロパティ名が`is`で始まる場合、異なる名前マッピングルールが使用されます。ゲッターの名前はプロパティ名と同じになり、セッターの名前は`is`を`set`に置き換えることで得られます。
例えば、プロパティ`isOpen`の場合、ゲッターは`isOpen()`、セッターは`setOpen()`と呼び出されます。
このルールは、`Boolean`だけでなく、あらゆる型のプロパティに適用されます。

## パッケージレベル関数

`org.example`パッケージ内の`app.kt`ファイルで宣言されたすべての関数とプロパティ（拡張関数を含む）は、`org.example.AppKt`という名前のJavaクラスの静的メソッドにコンパイルされます。

```kotlin
// app.kt
package org.example

class Util

fun getTime() { /*...*/ }

```

```java
// Java
new org.example.Util();
org.example.AppKt.getTime();
```

生成されるJavaクラスにカスタム名を指定するには、`@JvmName`アノテーションを使用します。

```kotlin
@file:JvmName("DemoUtils")

package org.example

class Util

fun getTime() { /*...*/ }

```

```java
// Java
new org.example.Util();
org.example.DemoUtils.getTime();
```

生成されるJavaクラス名が同じ（同じパッケージとファイル名、または同じ[`@JvmName`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-name/index.html)アノテーション）の複数のファイルを持つことは、通常はエラーです。
しかし、コンパイラは、指定された名前を持ち、その名前を持つすべてのファイルからの宣言をすべて含む単一のJavaファサードクラスを生成できます。
そのようなファサードの生成を有効にするには、すべての該当ファイルで[`@JvmMultifileClass`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-multifile-class/index.html)アノテーションを使用します。

```kotlin
// oldutils.kt
@file:JvmName("Utils")
@file:JvmMultifileClass

package org.example

fun getTime() { /*...*/ }
```

```kotlin
// newutils.kt
@file:JvmName("Utils")
@file:JvmMultifileClass

package org.example

fun getDate() { /*...*/ }
```

```java
// Java
org.example.Utils.getTime();
org.example.Utils.getDate();
```

## インスタンスフィールド

KotlinプロパティをJavaのフィールドとして公開する必要がある場合は、[`@JvmField`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-field/index.html)アノテーションを付けます。
フィールドは、基となるプロパティと同じ可視性（visibility）を持ちます。`@JvmField`アノテーションを付けることができるプロパティは以下の通りです。
* バッキングフィールドを持つ
* privateでない
* `open`、`override`、`const`修飾子を持たない
* 委譲プロパティでない

```kotlin
class User(id: String) {
    @JvmField val ID = id
}
```

```java

// Java
class JavaClient {
    public String getID(User user) {
        return user.ID;
    }
}
```

[遅延初期化](properties.md#late-initialized-properties-and-variables)プロパティもフィールドとして公開されます。
フィールドの可視性は、`lateinit`プロパティのセッターの可視性と同じになります。

## 静的フィールド

名前付きオブジェクトまたはコンパニオンオブジェクトで宣言されたKotlinプロパティは、その名前付きオブジェクト内、またはコンパニオンオブジェクトを含むクラス内に静的バッキングフィールドを持ちます。

通常、これらのフィールドはprivateですが、以下のいずれかの方法で公開できます。

 - [`@JvmField`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-field/index.html)アノテーション
 - `lateinit`修飾子
 - `const`修飾子
 
そのようなプロパティに`@JvmField`アノテーションを付けると、プロパティ自体と同じ可視性を持つ静的フィールドになります。

```kotlin
class Key(val value: Int) {
    companion object {
        @JvmField
        val COMPARATOR: Comparator<Key> = compareBy<Key> { it.value }
    }
}
```

```java
// Java
Key.COMPARATOR.compare(key1, key2);
// public static final field in Key class
```

オブジェクトまたはコンパニオンオブジェクト内の[遅延初期化](properties.md#late-initialized-properties-and-variables)プロパティは、プロパティセッターと同じ可視性を持つ静的バッキングフィールドを持ちます。

```kotlin
object Singleton {
    lateinit var provider: Provider
}
```

```java

// Java
Singleton.provider = new Provider();
// public static non-final field in Singleton class
```

`const`として宣言されたプロパティ（クラス内およびトップレベルの両方）は、Javaでは静的フィールドに変換されます。

```kotlin
// file example.kt

object Obj {
    const val CONST = 1
}

class C {
    companion object {
        const val VERSION = 9
    }
}

const val MAX = 239
```

Javaでは：

```java

int constant = Obj.CONST;
int max = ExampleKt.MAX;
int version = C.VERSION;
```

## 静的メソッド

上述の通り、Kotlinはパッケージレベルの関数を静的メソッドとして表現します。
名前付きオブジェクトまたはコンパニオンオブジェクトで定義された関数を[`@JvmStatic`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-static/index.html)としてアノテーションした場合、Kotlinはそれらの関数に対して静的メソッドも生成できます。
このアノテーションを使用すると、コンパイラはオブジェクトの囲むクラス内の静的メソッドと、オブジェクト自体のインスタンスメソッドの両方を生成します。例えば：

```kotlin
class C {
    companion object {
        @JvmStatic fun callStatic() {}
        fun callNonStatic() {}
    }
}
```

これにより、`callStatic()`はJavaで静的になりますが、`callNonStatic()`は静的ではありません。

```java

C.callStatic(); // works fine
C.callNonStatic(); // error: not a static method
C.Companion.callStatic(); // instance method remains
C.Companion.callNonStatic(); // the only way it works
```

名前付きオブジェクトでも同様です。

```kotlin
object Obj {
    @JvmStatic fun callStatic() {}
    fun callNonStatic() {}
}
```

Javaでは：

```java

Obj.callStatic(); // works fine
Obj.callNonStatic(); // error
Obj.INSTANCE.callNonStatic(); // works, a call through the singleton instance
Obj.INSTANCE.callStatic(); // works too
```

Kotlin 1.3以降、`@JvmStatic`はインターフェースのコンパニオンオブジェクトで定義された関数にも適用されます。
そのような関数はインターフェース内の静的メソッドにコンパイルされます。インターフェースの静的メソッドはJava 1.8で導入されたため、対応するターゲットを使用するように注意してください。

```kotlin
interface ChatBot {
    companion object {
        @JvmStatic fun greet(username: String) {
            println("Hello, $username")
        }
    }
}
```

`@JvmStatic`アノテーションは、オブジェクトまたはコンパニオンオブジェクトのプロパティにも適用でき、そのゲッターメソッドとセッターメソッドを、そのオブジェクトまたはコンパニオンオブジェクトを含むクラスの静的メンバーにすることができます。

## インターフェースのデフォルトメソッド

>デフォルトメソッドはJVM 1.8以降のターゲットでのみ利用可能です。
>
{style="note"}

JDK 1.8以降、Javaのインターフェースは[デフォルトメソッド](https://docs.oracle.com/javase/tutorial/java/IandI/defaultmethods.html)を含むことができます。
Kotlinインターフェースのすべての非抽象メンバーを、それを実装するJavaクラスのデフォルトにするには、Kotlinコードを`-Xjvm-default=all`コンパイラオプションでコンパイルします。

デフォルトメソッドを持つKotlinインターフェースの例です。

```kotlin
// compile with -Xjvm-default=all

interface Robot {
    fun move() { println("~walking~") }  // Javaインターフェースではデフォルトになります
    fun speak(): Unit
}
```

デフォルトの実装は、そのインターフェースを実装するJavaクラスで利用可能です。

```java
//Java implementation
public class C3PO implements Robot {
    // move() implementation from Robot is available implicitly
    @Override
    public void speak() {
        System.out.println("I beg your pardon, sir");
    }
}
```

```java
C3PO c3po = new C3PO();
c3po.move(); // default implementation from the Robot interface
c3po.speak();
```

インターフェースの実装は、デフォルトメソッドをオーバーライドできます。

```java
//Java
public class BB8 implements Robot {
    //デフォルトメソッドの独自の実装
    @Override
    public void move() {
        System.out.println("~rolling~");
    }

    @Override
    public void speak() {
        System.out.println("Beep-beep");
    }
}
```

> Kotlin 1.4より前では、デフォルトメソッドを生成するために、これらのメソッドに`@JvmDefault`アノテーションを使用できました。
> 1.4以降で`-Xjvm-default=all`でコンパイルすると、通常はインターフェースのすべての非抽象メソッドに`@JvmDefault`をアノテーションし、`-Xjvm-default=enable`でコンパイルしたかのように動作します。ただし、動作が異なる場合があります。
> Kotlin 1.4でのデフォルトメソッド生成の変更に関する詳細情報は、Kotlinブログの[こちらの記事](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)に記載されています。
>
{style="note"}

### デフォルトメソッドの互換性モード

`-Xjvm-default=all`オプションなしでコンパイルされたKotlinインターフェースを使用しているクライアントがいる場合、このオプションでコンパイルされたコードとはバイナリ互換性がない可能性があります。そのようなクライアントとの互換性を損なわないようにするには、`-Xjvm-default=all`モードを使用し、インターフェースに[`@JvmDefaultWithCompatibility`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-default-with-compatibility/)アノテーションを付けます。
これにより、一度公開APIのすべてのインターフェースにこのアノテーションを追加すれば、新しい非公開コードに対してはアノテーションを使用する必要がなくなります。

> Kotlin 1.6.20以降では、デフォルトモード（`-Xjvm-default=disable`コンパイラオプション）のモジュールを、`-Xjvm-default=all`または`-Xjvm-default=all-compatibility`モードでコンパイルされたモジュールに対してコンパイルできます。
>
{style="note"}

互換性モードの詳細：

#### disable {initial-collapse-state="collapsed" collapsible="true"}

デフォルトの動作です。JVMデフォルトメソッドを生成せず、`@JvmDefault`アノテーションの使用を禁止します。

#### all {initial-collapse-state="collapsed" collapsible="true"}

モジュール内のボディを持つすべてのインターフェース宣言に対してJVMデフォルトメソッドを生成します。`disable`モードでデフォルトで生成される、ボディを持つインターフェース宣言に対する[`DefaultImpls`](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)スタブは生成しません。

インターフェースが`disable`モードでコンパイルされたインターフェースからボディを持つメソッドを継承し、それをオーバーライドしない場合、そのメソッドに対して`DefaultImpls`スタブが生成されます。

`DefaultImpls`クラスの存在にクライアントコードが依存している場合、**バイナリ互換性が損なわれます**。

> インターフェースの委譲が使用されている場合、すべてのインターフェースメソッドが委譲されます。唯一の例外は、非推奨の`@JvmDefault`アノテーションが付けられたメソッドです。
>
{style="note"}

#### all-compatibility {initial-collapse-state="collapsed" collapsible="true"}

`all`モードに加えて、[`DefaultImpls`](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)クラス内に互換性スタブを生成します。互換性スタブは、ライブラリおよびランタイムの作成者にとって、以前のライブラリバージョンに対してコンパイルされた既存のクライアントとの後方バイナリ互換性を維持するために役立ちます。
`all`および`all-compatibility`モードは、ライブラリの再コンパイル後にクライアントが使用するライブラリのABI（Application Binary Interface）表面を変更します。
その意味で、クライアントは以前のライブラリバージョンと互換性がなくなる可能性があります。
これは通常、適切なライブラリのバージョン管理、例えばSemVerにおけるメジャーバージョンアップが必要であることを意味します。

コンパイラは、`DefaultImpls`のすべてのメンバーを`@Deprecated`アノテーション付きで生成します。これらのメンバーは互換性の目的でのみ生成されるため、Javaコードで使用すべきではありません。

`all`または`all-compatibility`モードでコンパイルされたKotlinインターフェースからの継承の場合、`DefaultImpls`互換性スタブは、標準のJVMランタイム解決セマンティクスでインターフェースのデフォルトメソッドを呼び出します。

`disable`モードで特殊化されたシグネチャを持つ追加の暗黙的メソッドが生成される場合がある、ジェネリックインターフェースを継承するクラスに対して、追加の互換性チェックを実行します。
`disable`モードとは異なり、そのようなメソッドを明示的にオーバーライドせず、クラスに`@JvmDefaultWithoutCompatibility`アノテーションを付けない場合、コンパイラはエラーを報告します（詳細は[このYouTrackイシュー](https://youtrack.jetbrains.com/issue/KT-39603)を参照してください）。

## 可視性

Kotlinの可視性修飾子は、Javaに以下のようにマッピングされます。

* `private`メンバーは`private`メンバーにコンパイルされます。
* `private`トップレベル宣言は`private`トップレベル宣言にコンパイルされます。クラス内からアクセスされる場合は、パッケージプライベートなアクセサーも含まれます。
* `protected`は`protected`のままです（Javaは同じパッケージ内の他のクラスからprotectedメンバーにアクセスできますが、Kotlinはできません。そのため、Javaクラスはコードに対してより広いアクセス権を持つことになります）。
* `internal`宣言はJavaでは`public`になります。`internal`クラスのメンバーは名前マングリングが行われ、Javaから誤って使用することを難しくし、Kotlinのルールに従ってお互いを認識しない同じシグネチャを持つメンバーのオーバーロードを可能にします。
* `public`は`public`のままです。

## KClass

Kotlinメソッドを`KClass`型の引数で呼び出す必要がある場合があります。
`Class`から`KClass`への自動変換はないため、`Class<T>.kotlin`拡張プロパティに相当するものを呼び出すことで手動で行う必要があります。

```kotlin
kotlin.jvm.JvmClassMappingKt.getKotlinClass(MainView.class)
```

## @JvmNameによるシグネチャの競合の回避

Kotlinには名前付き関数がありますが、バイトコードでは異なるJVM名が必要となる場合があります。
最も顕著な例は、*型消去（type erasure）*によって発生します。

```kotlin
fun List<String>.filterValid(): List<String>
fun List<Int>.filterValid(): List<Int>
```

これらの2つの関数は、JVMシグネチャが`filterValid(Ljava/util/List;)Ljava/util/List;`と同じであるため、並行して定義することはできません。
Kotlinでそれらを同じ名前にしたい場合は、一方（または両方）に[`@JvmName`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-name/index.html)アノテーションを付けて、引数として異なる名前を指定できます。

```kotlin
fun List<String>.filterValid(): List<String>

@JvmName("filterValidInt")
fun List<Int>.filterValid(): List<Int>
```

Kotlinからは同じ名前`filterValid`でアクセスできますが、Javaからは`filterValid`と`filterValidInt`になります。

プロパティ`x`を関数`getX()`と並行して持つ必要がある場合も、同じテクニックが適用されます。

```kotlin
val x: Int
    @JvmName("getX_prop")
    get() = 15

fun getX() = 10
```

明示的に実装されたゲッターとセッターを持たないプロパティの生成されたアクセサーメソッドの名前を変更するには、`@get:JvmName`と`@set:JvmName`を使用できます。

```kotlin
@get:JvmName("x")
@set:JvmName("changeX")
var x: Int = 23
```

## オーバーロードの生成

通常、デフォルトの引数を持つKotlin関数を記述した場合、Javaからはすべての引数が存在する完全なシグネチャとしてのみ見えます。
Java呼び出し元に複数のオーバーロードを公開したい場合は、[`@JvmOverloads`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-overloads/index.html)アノテーションを使用できます。

このアノテーションは、コンストラクタ、静的メソッドなどにも機能します。抽象メソッド、インターフェースで定義されたメソッドを含む、抽象メソッドには使用できません。

```kotlin
class Circle @JvmOverloads constructor(centerX: Int, centerY: Int, radius: Double = 1.0) {
    @JvmOverloads fun draw(label: String, lineWidth: Int = 1, color: String = "red") { /*...*/ }
}
```

デフォルト値を持つすべての引数について、これにより、その引数と、引数リスト内でその右にあるすべての引数が削除された、追加のオーバーロードが1つ生成されます。この例では、以下が生成されます。

```java
// コンストラクタ:
Circle(int centerX, int centerY, double radius)
Circle(int centerX, int centerY)

// メソッド
void draw(String label, int lineWidth, String color) { }
void draw(String label, int lineWidth) { }
void draw(String label) { }
```

[セカンダリコンストラクタ](classes.md#secondary-constructors)で説明されているように、クラスがすべてのコンストラクタ引数にデフォルト値を持っている場合、引数なしのpublicコンストラクタが生成されることに注意してください。これは、`@JvmOverloads`アノテーションが指定されていなくても機能します。

## チェック済み例外

Kotlinにはチェック済み例外（checked exceptions）はありません。
そのため、通常、Kotlin関数のJavaシグネチャはスローされる例外を宣言しません。
したがって、Kotlinで次のような関数がある場合：

```kotlin
// example.kt
package demo

fun writeToFile() {
    /*...*/
    throw IOException()
}
```

そして、Javaから呼び出して例外をキャッチしたい場合：

```java

// Java
try {
    demo.Example.writeToFile();
} catch (IOException e) { 
    // エラー: writeToFile() はスローリストに IOException を宣言していません
    // ...
}
```

`writeToFile()`が`IOException`を宣言していないため、Javaコンパイラからエラーメッセージが表示されます。
この問題を回避するには、Kotlinで[`@Throws`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throws/index.html)アノテーションを使用します。

```kotlin
@Throws(IOException::class)
fun writeToFile() {
    /*...*/
    throw IOException()
}
```

## Null安全性

JavaからKotlin関数を呼び出す際、非null許容パラメータとして`null`を渡すことを誰も妨げません。
そのため、Kotlinは非nullを期待するすべてのpublic関数に対してランタイムチェックを生成します。
このようにして、Javaコードで即座に`NullPointerException`が発生します。

## 共変なジェネリクス

Kotlinクラスが[宣言サイト共変性](generics.md#declaration-site-variance)を利用する場合、その使用方法がJavaコードからどのように見えるかには2つの選択肢があります。例えば、次のようなクラスと、それを使用する2つの関数があるとします。

```kotlin
class Box<out T>(val value: T)

interface Base
class Derived : Base

fun boxDerived(value: Derived): Box<Derived> = Box(value)
fun unboxBase(box: Box<Base>): Base = box.value
```

これらの関数をJavaに変換する素朴な方法は次のようになります。

```java
Box<Derived> boxDerived(Derived value) { ... }
Base unboxBase(Box<Base> box) { ... }
```

問題は、Kotlinでは`unboxBase(boxDerived(Derived()))`と記述できるのに対し、Javaでは`Box`クラスがそのパラメータ`T`に対して*不変*であり、`Box<Derived>`が`Box<Base>`のサブタイプではないため、それが不可能であることです。
Javaでこれを機能させるには、`unboxBase`を次のように定義する必要があります。

```java
Base unboxBase(Box<? extends Base> box) { ... }  
```

この宣言は、Javaが持つのは使用サイト共変性のみであるため、Javaの*ワイルドカード型*（`? extends Base`）を使用して、宣言サイト共変性を使用サイト共変性によってエミュレートしています。

Kotlin APIをJavaで動作させるために、コンパイラは、共変に定義された`Box`の場合（または反変に定義された`Foo`の場合に`Foo<? super Bar>`）、`Box<Super>`が*パラメータ*として出現するときに`Box<? extends Super>`として生成します。
戻り値の場合、ワイルドカードは生成されません。これは、ワイルドカードが生成されるとJavaクライアントがそれらを処理する必要があるため（そして、それは一般的なJavaのコーディングスタイルに反するため）です。
したがって、例の関数は実際に次のように変換されます。

```java

// 戻り値の型 - ワイルドカードなし
Box<Derived> boxDerived(Derived value) { ... }
 
// パラメータ - ワイルドカードあり
Base unboxBase(Box<? extends Base> box) { ... }
```

> 引数の型が`final`の場合、ワイルドカードを生成する意味は通常ありません。そのため、`Box<String>`はどのような位置にあっても常に`Box<String>`になります。
>
{style="note"}

デフォルトではワイルドカードが生成されない場所でワイルドカードが必要な場合は、`@JvmWildcard`アノテーションを使用します。

```kotlin
fun boxDerived(value: Derived): Box<@JvmWildcard Derived> = Box(value)
// に変換されます
// Box<? extends Derived> boxDerived(Derived value) { ... }
```

逆に、ワイルドカードが生成される場所でワイルドカードが不要な場合は、`@JvmSuppressWildcards`を使用します。

```kotlin
fun unboxBase(box: Box<@JvmSuppressWildcards Base>): Base = box.value
// に変換されます
// Base unboxBase(Box<Base> box) { ... }
```

>`@JvmSuppressWildcards`は、個々の型引数だけでなく、関数やクラスといった宣言全体にも使用でき、その中のすべてのワイルドカードを抑制できます。
>
{style="note"}

### Nothing型の変換
 
型[`Nothing`](exceptions.md#the-nothing-type)は、Javaに自然な対応物がないため、特殊です。実際、`java.lang.Void`を含むすべてのJava参照型は`null`を値として受け入れますが、`Nothing`はそれすら受け入れません。
そのため、この型をJavaの世界で正確に表現することはできません。
これが、`Nothing`型の引数が使用される場合にKotlinがraw型を生成する理由です。

```kotlin
fun emptyList(): List<Nothing> = listOf()
// に変換されます
// List emptyList() { ... }