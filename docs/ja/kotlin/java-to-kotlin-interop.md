[//]: # (title: JavaからKotlinを呼び出す)

KotlinコードはJavaから簡単に呼び出すことができます。
例えば、KotlinクラスのインスタンスはJavaメソッド内でシームレスに作成し、操作できます。
しかし、JavaにKotlinコードを統合する際には、JavaとKotlinの間に注意が必要な特定の相違点があります。
このページでは、KotlinコードとJavaクライアントとの相互運用を調整する方法について説明します。

## プロパティ

Kotlinのプロパティは、以下のJava要素にコンパイルされます。

*   ゲッターメソッド。名前は`get`プレフィックスを前置して計算されます。
*   セッターメソッド。名前は`set`プレフィックスを前置して計算されます（`var`プロパティの場合のみ）。
*   プライベートフィールド。プロパティ名と同じ名前です（バッキングフィールドを持つプロパティの場合のみ）。

例えば、`var firstName: String`は以下のJava宣言にコンパイルされます。

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
例えば、`isOpen`というプロパティの場合、ゲッターは`isOpen()`と呼ばれ、セッターは`setOpen()`と呼ばれます。
このルールは、`Boolean`だけでなく、あらゆる型のプロパティに適用されます。

## パッケージレベルの関数

拡張関数を含む、`org.example`パッケージ内のファイル`app.kt`で宣言されたすべての関数とプロパティは、`org.example.AppKt`という名前のJavaクラスの静的メソッドにコンパイルされます。

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

同じ生成されたJavaクラス名（同じパッケージ、同じ名前、または同じ[`@JvmName`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-name/index.html)アノテーション）を持つ複数のファイルが存在することは、通常エラーです。
しかし、コンパイラは、指定された名前を持ち、その名前を持つすべてのファイルからのすべての宣言を含む単一のJavaファサードクラスを生成できます。
このようなファサードの生成を有効にするには、関連するすべてのファイルで[`@JvmMultifileClass`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-multifile-class/index.html)アノテーションを使用します。

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

KotlinのプロパティをJavaのフィールドとして公開する必要がある場合、[`@JvmField`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-field/index.html)アノテーションを付与します。
フィールドは、基となるプロパティと同じ可視性を持ちます。プロパティに`@JvmField`を付与できるのは、以下の条件を満たす場合です。
*   バッキングフィールドを持つ
*   プライベートではない
*   `open`、`override`、または`const`修飾子を持たない
*   委譲プロパティではない

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
フィールドの可視性は、`lateinit`プロパティのセッターの可視性と同じです。

## 静的フィールド

名前付きオブジェクトまたはコンパニオンオブジェクトで宣言されたKotlinプロパティは、その名前付きオブジェクト内、またはコンパニオンオブジェクトを含むクラス内に静的なバッキングフィールドを持ちます。

通常、これらのフィールドはプライベートですが、以下のいずれかの方法で公開できます。

*   [`@JvmField`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-field/index.html)アノテーション
*   `lateinit`修飾子
*   `const`修飾子

そのようなプロパティに`@JvmField`を付与すると、プロパティ自体と同じ可視性を持つ静的フィールドになります。

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

前述のとおり、Kotlinはパッケージレベルの関数を静的メソッドとして表現します。
Kotlinは、名前付きオブジェクトまたはコンパニオンオブジェクトで定義された関数に`@JvmStatic`アノテーションを付与すると、それらの関数の静的メソッドも生成できます。
このアノテーションを使用すると、コンパイラはオブジェクトを囲むクラス内の静的メソッドと、オブジェクト自体のインスタンスメソッドの両方を生成します。例えば：

```kotlin
class C {
    companion object {
        @JvmStatic fun callStatic() {}
        fun callNonStatic() {}
    }
}
```

この場合、`callStatic()`はJavaで静的ですが、`callNonStatic()`はそうではありません。

```java

C.callStatic(); // works fine
C.callNonStatic(); // error: not a static method
C.Companion.callStatic(); // instance method remains
C.Companion.callNonStatic(); // the only way it works
```

同様に、名前付きオブジェクトの場合：

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
このような関数は、インターフェース内の静的メソッドにコンパイルされます。インターフェース内の静的メソッドはJava 1.8で導入されたため、対応するターゲットを使用するようにしてください。

```kotlin
interface ChatBot {
    companion object {
        @JvmStatic fun greet(username: String) {
            println("Hello, $username")
        }
    }
}
```

オブジェクトまたはコンパニオンオブジェクトのプロパティに`@JvmStatic`アノテーションを適用することもでき、これによりそのゲッターおよびセッターメソッドが、そのオブジェクトまたはコンパニオンオブジェクトを含むクラス内の静的メンバーになります。

## インターフェースのデフォルトメソッド

JVMをターゲットとする場合、Kotlinはインターフェースで宣言された関数を、[別途設定されていない限り](#compatibility-modes-for-default-methods)、[デフォルトメソッド](https://docs.oracle.com/javase/tutorial/java/IandI/defaultmethods.html)にコンパイルします。
これらは、Javaクラスが再実装なしで直接継承できるインターフェース内の具象メソッドです。

Kotlinインターフェースのデフォルトメソッドの例を以下に示します。

```kotlin
interface Robot {
    fun move() { println("~walking~") }  // will be default in the Java interface
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
    //own implementation of the default method
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

### デフォルトメソッドの互換性モード

Kotlinは、インターフェース内の関数がJVMのデフォルトメソッドにコンパイルされる方法を制御するための3つのモードを提供します。
これらのモードは、コンパイラが互換性ブリッジと`DefaultImpls`クラス内の静的メソッドを生成するかどうかを決定します。

この動作は、`-jvm-default`コンパイラオプションを使用して制御できます。

> `-jvm-default`コンパイラオプションは、非推奨の`-Xjvm-default`オプションを置き換えるものです。
>
{style="note"}

互換性モードについて詳しくはこちら：

#### enable {initial-collapse-state="collapsed" collapsible="true"}

デフォルトの動作。
インターフェースにデフォルト実装を生成し、互換性ブリッジと`DefaultImpls`クラスを含みます。
このモードは、古いコンパイル済みKotlinコードとの互換性を維持します。

#### no-compatibility {initial-collapse-state="collapsed" collapsible="true"}

インターフェースにデフォルト実装のみを生成します。
互換性ブリッジと`DefaultImpls`クラスをスキップします。
`DefaultImpls`クラスに依存するコードと相互作用しない新しいコードベースにこのモードを使用してください。
これにより、古いKotlinコードとのバイナリ互換性が損なわれる可能性があります。

> インターフェース委譲が使用されている場合、すべてのインターフェースメソッドが委譲されます。
>
{style="note"}

#### disable {initial-collapse-state="collapsed" collapsible="true"}

インターフェースにおけるデフォルト実装を無効にします。
互換性ブリッジと`DefaultImpls`クラスのみが生成されます。

## 可視性

Kotlinの可視性修飾子は、Javaに以下のようにマッピングされます。

*   `private`メンバーは`private`メンバーにコンパイルされます。
*   `private`トップレベル宣言は`private`トップレベル宣言にコンパイルされます。クラス内からアクセスされる場合、パッケージプライベートアクセサーも含まれます。
*   `protected`は`protected`のままです。（Javaは同じパッケージ内の他のクラスからプロテクテッドメンバーへのアクセスを許可しますが、Kotlinはそうではないため、Javaクラスはコードに対してより広いアクセス権を持ちます。）
*   `internal`宣言はJavaでは`public`になります。`internal`クラスのメンバーは名前マングリング（名前の改変）を受けます。これは、Javaから誤って使用することを困難にし、Kotlinのルールに従って互いに見えない同じシグネチャを持つメンバーのオーバーロードを許可するためです。
*   `public`は`public`のままです。

## KClass

Kotlinメソッドを`KClass`型のパラメータで呼び出す必要がある場合があります。
`Class`から`KClass`への自動変換はないため、`Class<T>.kotlin`拡張プロパティに相当するものを呼び出すことで手動で行う必要があります。

```kotlin
kotlin.jvm.JvmClassMappingKt.getKotlinClass(MainView.class)
```

## @JvmNameによるシグネチャ競合の処理

Kotlinでは名前付き関数が存在し、バイトコードでは異なるJVM名が必要となる場合があります。
最も顕著な例は、*型消去*によって発生します。

```kotlin
fun List<String>.filterValid(): List<String>
fun List<Int>.filterValid(): List<Int>
```

これらの2つの関数は、JVMシグネチャが同じであるため、並べて定義することはできません：`filterValid(Ljava/util/List;)Ljava/util/List;`。
Kotlinで同じ名前を持たせたい場合、一方（または両方）に[`@JvmName`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-name/index.html)アノテーションを付与し、引数として異なる名前を指定できます。

```kotlin
fun List<String>.filterValid(): List<String>

@JvmName("filterValidInt")
fun List<Int>.filterValid(): List<Int>
```

Kotlinからは同じ`filterValid`という名前でアクセスできますが、Javaからは`filterValid`と`filterValidInt`になります。

プロパティ`x`と関数`getX()`を同時に持つ必要がある場合も、同じ手法が適用されます。

```kotlin
val x: Int
    @JvmName("getX_prop")
    get() = 15

fun getX() = 10
```

明示的に実装されていないゲッターとセッターを持つプロパティの生成されるアクセサーメソッドの名前を変更するには、`@get:JvmName`と`@set:JvmName`を使用できます。

```kotlin
@get:JvmName("x")
@set:JvmName("changeX")
var x: Int = 23
```

## オーバーロードの生成

通常、デフォルト引数を持つKotlin関数を記述した場合、Javaではすべての引数が存在する完全なシグネチャとしてのみ可視化されます。Javaの呼び出し元に複数のオーバーロードを公開したい場合は、[`@JvmOverloads`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-overloads/index.html)アノテーションを使用できます。

このアノテーションは、コンストラクタ、静的メソッドなどにも機能します。インターフェースで定義されたメソッドを含む抽象メソッドには使用できません。

```kotlin
class Circle @JvmOverloads constructor(centerX: Int, centerY: Int, radius: Double = 1.0) {
    @JvmOverloads fun draw(label: String, lineWidth: Int = 1, color: String = "red") { /*...*/ }
}
```

デフォルト値を持つパラメータごとに、そのパラメータとそれより右にあるすべてのパラメータが引数リストから削除された、追加のオーバーロードが1つ生成されます。この例では、以下が生成されます。

```java
// Constructors:
Circle(int centerX, int centerY, double radius)
Circle(int centerX, int centerY)

// Methods
void draw(String label, int lineWidth, String color) { }
void draw(String label, int lineWidth) { }
void draw(String label) { }
```

なお、[セカンダリコンストラクタ](classes.md#secondary-constructors)で説明されているように、クラスがすべてのコンストラクタパラメータにデフォルト値を持つ場合、引数なしのpublicコンストラクタが生成されます。これは`@JvmOverloads`アノテーションが指定されていない場合でも機能します。

## チェック例外

Kotlinにはチェック例外がありません。
したがって、通常、Kotlin関数のJavaシグネチャはスローされる例外を宣言しません。
そのため、Kotlinに以下のような関数がある場合：

```kotlin
// example.kt
package demo

fun writeToFile() {
    /*...*/
    throw IOException()
}
```

そしてJavaからそれを呼び出して例外をキャッチしたい場合：

```java

// Java
try {
    demo.Example.writeToFile();
} catch (IOException e) { 
    // error: writeToFile() does not declare IOException in the throws list
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
そのため、Kotlinは非nullを期待するすべてのpublic関数に対して実行時チェックを生成します。
これにより、Javaコードで即座に`NullPointerException`が発生します。

## 変性ジェネリクス

Kotlinクラスが[宣言サイト変性](generics.md#declaration-site-variance)を利用する場合、Javaコードからその使用がどのように見られるかには2つの選択肢があります。例えば、以下のクラスとそのクラスを使用する2つの関数があるとします。

```kotlin
class Box<out T>(val value: T)

interface Base
class Derived : Base

fun boxDerived(value: Derived): Box<Derived> = Box(value)
fun unboxBase(box: Box<Base>): Base = box.value
```

これらの関数をJavaに翻訳する素朴な方法は次のようになります。

```java
Box<Derived> boxDerived(Derived value) { ... }
Base unboxBase(Box<Base> box) { ... }
```

問題は、Kotlinでは`unboxBase(boxDerived(Derived()))`と記述できるのに対し、Javaでは`Box`クラスがそのパラメータ`T`に対して*不変*であり、`Box<Derived>`が`Box<Base>`のサブタイプではないため、それが不可能であることです。
Javaでこれを機能させるには、`unboxBase`を次のように定義する必要があります。

```java
Base unboxBase(Box<? extends Base> box) { ... }  
```

この宣言は、Javaの*ワイルドカード型*（`? extends Base`）を使用して、ユースサイト変性を通じて宣言サイト変性をエミュレートします。これはJavaが持つ唯一の方法だからです。

Kotlin APIをJavaで機能させるために、コンパイラは、共変に定義された`Box`の場合（または反変に定義された`Foo`の場合、`Foo<? super Bar>`）、`Box<Super>`が*パラメータ*として現れるときに`Box<? extends Super>`として生成します。戻り値の場合、ワイルドカードは生成されません。そうしないと、Javaクライアントがそれらを扱う必要があり（そしてそれは一般的なJavaのコーディングスタイルに反するため）です。
したがって、私たちの例の関数は実際には次のように翻訳されます。

```java

// return type - no wildcards
Box<Derived> boxDerived(Derived value) { ... }
 
// parameter - wildcards 
Base unboxBase(Box<? extends Base> box) { ... }
```

> 引数型がfinalの場合、通常ワイルドカードを生成する意味がないため、`Box<String>`は、どのような位置にあっても常に`Box<String>`です。
>
{style="note"}

デフォルトでワイルドカードが生成されない場所でワイルドカードが必要な場合は、`@JvmWildcard`アノテーションを使用します。

```kotlin
fun boxDerived(value: Derived): Box<@JvmWildcard Derived> = Box(value)
// is translated to 
// Box<? extends Derived> boxDerived(Derived value) { ... }
```

反対に、ワイルドカードが生成される場所でワイルドカードが不要な場合は、`@JvmSuppressWildcards`を使用します。

```kotlin
fun unboxBase(box: Box<@JvmSuppressWildcards Base>): Base = box.value
// is translated to 
// Base unboxBase(Box<Base> box) { ... }
```

>`@JvmSuppressWildcards`は、個々の型引数だけでなく、関数やクラスなどの宣言全体にも使用でき、その中のすべてのワイルドカードを抑制します。
>
{style="note"}

### Nothing型の変換

型[`Nothing`](exceptions.md#the-nothing-type)は特殊であり、Javaには自然な対応物がありません。実際、`java.lang.Void`を含むすべてのJava参照型は`null`を値として受け入れますが、`Nothing`はそれすら受け入れません。したがって、この型はJavaの世界で正確に表現できません。
このため、Kotlinは`Nothing`型の引数が使用される場合に、raw型を生成します。

```kotlin
fun emptyList(): List<Nothing> = listOf()
// is translated to
// List emptyList() { ... }
```

## インライン値クラス

<primary-label ref="experimental-general"/>

JavaコードをKotlinの[インライン値クラス](inline-classes.md)とスムーズに連携させたい場合、[`@JvmExposeBoxed`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.jvm/-jvm-expose-boxed/)アノテーションまたは`-Xjvm-expose-boxed`コンパイラオプションを使用できます。これらのアプローチにより、KotlinはJavaの相互運用に必要なボックス化された表現を確実に生成します。

デフォルトでは、Kotlinはインライン値クラスを**アンボックス化された表現**を使用するようにコンパイルします。これはJavaからアクセスできないことが多いです。
例えば、Javaから`MyInt`クラスのコンストラクタを呼び出すことはできません。

```kotlin
@JvmInline
value class MyInt(val value: Int)
```

したがって、以下のJavaコードは失敗します。

```java
MyInt input = new MyInt(5);
```

`@JvmExposeBoxed`アノテーションを使用すると、KotlinがJavaから直接呼び出せるpublicコンストラクタを生成するようにできます。
Javaに公開する内容を細かく制御するために、このアノテーションを以下のレベルで適用できます。

*   クラス
*   コンストラクタ
*   関数

コードで`@JvmExposeBoxed`アノテーションを使用する前に、`@OptIn(ExperimentalStdlibApi::class)`を使用してオプトインする必要があります。
例えば：

```kotlin
@OptIn(ExperimentalStdlibApi::class)
@JvmExposeBoxed
@JvmInline
value class MyInt(val value: Int)

@OptIn(ExperimentalStdlibApi::class)
@JvmExposeBoxed
fun MyInt.timesTwoBoxed(): MyInt = MyInt(this.value * 2)
```

これらのアノテーションを使用すると、Kotlinは`MyInt`クラスのJavaからアクセス可能なコンストラクタ**と**、値クラスのボックス化された形式を使用する拡張関数のバリアントを生成します。これにより、以下のJavaコードが正常に実行されます。

```java
MyInt input = new MyInt(5);
MyInt output = ExampleKt.timesTwoBoxed(input);
```

この動作をモジュール内のすべてのインライン値クラスとそれらを使用する関数に適用するには、`-Xjvm-expose-boxed`オプションを使用してコンパイルします。
このオプションでコンパイルすると、モジュール内のすべての宣言が`@JvmExposeBoxed`アノテーションを持つかのような効果が得られます。

### 継承された関数

`@JvmExposeBoxed`アノテーションは、継承された関数のボックス化された表現を自動的に生成しません。

継承された関数に必要な表現を生成するには、実装または拡張するクラスでそれをオーバーライドします。

```kotlin
interface IdTransformer {
    fun transformId(rawId: UInt): UInt = rawId
}

// Doesn't generate a boxed representation for the transformId() function
@OptIn(ExperimentalStdlibApi::class)
@JvmExposeBoxed
class LightweightTransformer : IdTransformer

// Generates a boxed representation for the transformId() function
@OptIn(ExperimentalStdlibApi::class)
@JvmExposeBoxed
class DefaultTransformer : IdTransformer {
    override fun transformId(rawId: UInt): UInt = super.transformId(rawId)
}
```

Kotlinにおける継承の仕組みと、`super`キーワードを使用してスーパークラスの実装を呼び出す方法については、[継承](inheritance.md#calling-the-superclass-implementation)を参照してください。