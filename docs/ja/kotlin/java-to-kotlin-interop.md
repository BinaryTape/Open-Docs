---
title: JavaからのKotlinの呼び出し
---
KotlinのコードはJavaから簡単に呼び出すことができます。
例えば、Kotlinクラスのインスタンスは、Javaのメソッドでシームレスに生成および操作できます。
ただし、JavaとKotlinの間にはいくつかの違いがあり、KotlinのコードをJavaに統合する際には注意が必要です。
このページでは、KotlinのコードとJavaクライアントとの間の相互運用性を調整する方法について説明します。

## プロパティ

Kotlinのプロパティは、次のJava要素にコンパイルされます。

* getterメソッド。名前は`get`プレフィックスを付加して計算されます。
* setterメソッド。名前は`set`プレフィックスを付加して計算されます（`var`プロパティのみ）。
* privateフィールド。プロパティ名と同じ名前です（backing fieldを持つプロパティのみ）。

例えば、`var firstName: String`は、次のJavaの宣言にコンパイルされます。

```java
private String firstName;

public String getFirstName() {
    return firstName;
}

public void setFirstName(String firstName) {
    this.firstName = firstName;
}
```

プロパティの名前が`is`で始まる場合、別の名前マッピング規則が使用されます。getterの名前はプロパティ名と同じになり、setterの名前は`is`を`set`に置き換えることで取得されます。
例えば、プロパティ`isOpen`の場合、getterは`isOpen()`と呼ばれ、setterは`setOpen()`と呼ばれます。
この規則は、`Boolean`だけでなく、任意の型のプロパティに適用されます。

## パッケージレベルの関数

パッケージ`org.example`内のファイル`app.kt`で宣言されたすべての関数とプロパティ（extension functionを含む）は、`org.example.AppKt`という名前のJavaクラスのstatic methodにコンパイルされます。

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

生成されたJavaクラスにカスタム名を付けるには、`@JvmName` annotationを使用します。

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

同じ生成されたJavaクラス名（同じパッケージと同じ名前、または同じ[`@JvmName`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-name/index.html) annotation）を持つ複数のファイルがあることは、通常はエラーです。
ただし、コンパイラは、指定された名前を持ち、その名前を持つすべてのファイルのすべての宣言を含む単一のJava facade classを生成できます。
このようなfacadeの生成を有効にするには、そのようなすべてのファイルで[`@JvmMultifileClass`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-multifile-class/index.html) annotationを使用します。

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

## Instance fields

KotlinのプロパティをJavaのfieldとして公開する必要がある場合は、[`@JvmField`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-field/index.html) annotationを付けてください。
fieldは、基になるプロパティと同じ可視性を持ちます。プロパティが次の条件を満たす場合、`@JvmField`でannotationを付けることができます。
* backing fieldがある
* privateではない
* `open`、`override`、または`const` modifierがない
* delegated propertyではない

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

[Late-Initialized](properties#late-initialized-properties-and-variables) propertiesもfieldとして公開されます。
fieldの可視性は、`lateinit` property setterの可視性と同じになります。

## Static fields

named objectまたはcompanion objectで宣言されたKotlinのプロパティは、そのnamed objectまたはcompanion objectを含むクラスにstatic backing fieldを持ちます。

通常、これらのfieldはprivateですが、次のいずれかの方法で公開できます。

- [`@JvmField`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-field/index.html) annotation
- `lateinit` modifier
- `const` modifier

このようなプロパティに`@JvmField`でannotationを付けると、プロパティ自体と同じ可視性を持つstatic fieldになります。

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

objectまたはcompanion objectの[late-initialized](properties#late-initialized-properties-and-variables) propertyには、property setterと同じ可視性を持つstatic backing fieldがあります。

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

`const`として宣言されたプロパティ（クラス内およびトップレベル）は、Javaのstatic fieldに変換されます。

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

In Java:

```java

int constant = Obj.CONST;
int max = ExampleKt.MAX;
int version = C.VERSION;
```

## Static methods

上記のように、Kotlinはパッケージレベルの関数をstatic methodとして表します。
Kotlinは、named objectまたはcompanion objectで定義された関数に[`@JvmStatic`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-static/index.html) annotationを付けると、static methodを生成することもできます。
このannotationを使用すると、コンパイラはobjectの囲みクラスのstatic methodと、object自体のinstance methodの両方を生成します。 例：

```kotlin
class C {
    companion object {
        @JvmStatic fun callStatic() {}
        fun callNonStatic() {}
    }
}
```

これで、`callStatic()`はJavaではstaticですが、`callNonStatic()`はstaticではありません。

```java

C.callStatic(); // works fine
C.callNonStatic(); // error: not a static method
C.Companion.callStatic(); // instance method remains
C.Companion.callNonStatic(); // the only way it works
```

named objectも同様です。

```kotlin
object Obj {
    @JvmStatic fun callStatic() {}
    fun callNonStatic() {}
}
```

In Java:

```java

Obj.callStatic(); // works fine
Obj.callNonStatic(); // error
Obj.INSTANCE.callNonStatic(); // works, a call through the singleton instance
Obj.INSTANCE.callStatic(); // works too
```

Kotlin 1.3以降、`@JvmStatic`はインターフェースのcompanion objectで定義された関数にも適用されます。
このような関数は、インターフェースのstatic methodにコンパイルされます。 インターフェースのstatic methodはJava 1.8で導入されたため、対応するターゲットを使用するようにしてください。

```kotlin
interface ChatBot {
    companion object {
        @JvmStatic fun greet(username: String) {
            println("Hello, $username")
        }
    }
}
```

`@JvmStatic` annotationは、objectまたはcompanion objectのプロパティにも適用でき、そのgetterおよびsetter methodを、そのobjectまたはcompanion objectを含むクラスのstatic memberにすることができます。

## インターフェースのDefault methods

:::note
Default methodsは、ターゲットJVM 1.8以降でのみ使用できます。

:::

JDK 1.8以降、Javaのインターフェースには[default methods](https://docs.oracle.com/javase/tutorial/java/IandI/defaultmethods.html)を含めることができます。
Kotlinインターフェースの抽象的でないすべてのmemberを、それらを実装するJavaクラスのdefaultにするには、`-Xjvm-default=all`コンパイラオプションを使用してKotlinコードをコンパイルします。

Default methodを持つKotlinインターフェースの例を次に示します。

```kotlin
// compile with -Xjvm-default=all

interface Robot {
    fun move() { println("~walking~") }  // will be default in the Java interface
    fun speak(): Unit
}
```

defaultの実装は、インターフェースを実装するJavaクラスで使用できます。

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

インターフェースの実装は、default methodをoverrideできます。

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

:::note
Kotlin 1.4より前は、default methodを生成するために、これらのmethodに`@JvmDefault` annotationを使用できました。
1.4以降で`-Xjvm-default=all`でコンパイルすると、通常はインターフェースの抽象的でないすべてのmethodに`@JvmDefault`でannotationを付け、`-Xjvm-default=enable`でコンパイルした場合と同様に機能します。 ただし、それらの動作が異なる場合があります。
Kotlin 1.4でのdefault method生成の変更に関する詳細情報は、Kotlinブログの[この投稿](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)に記載されています。

:::

### Default methodsの互換性モード

`-Xjvm-default=all`オプションなしでコンパイルされたKotlinインターフェースを使用するクライアントがある場合、このオプションでコンパイルされたコードとのバイナリ互換性がない可能性があります。 このようなクライアントとの互換性を損なわないようにするには、`-Xjvm-default=all`モードを使用し、[`@JvmDefaultWithCompatibility`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-default-with-compatibility/) annotationでインターフェースをマークします。
これにより、このannotationをパブリックAPIのすべてのインターフェースに一度だけ追加でき、新しいパブリックでないコードにannotationを使用する必要はありません。

:::note
Kotlin 1.6.20以降、デフォルトモード（`-Xjvm-default=disable`コンパイラオプション）で、`-Xjvm-default=all`または`-Xjvm-default=all-compatibility`モードでコンパイルされたモジュールに対してモジュールをコンパイルできます。

:::

互換性モードの詳細：

#### disable

デフォルトの動作。 JVM default methodを生成せず、`@JvmDefault` annotationの使用を禁止します。

#### all

モジュール内のボディを持つすべてのインターフェース宣言に対して、JVM default methodを生成します。 `disable`モードでデフォルトで生成される、ボディを持つインターフェース宣言の[`DefaultImpls`](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)スタブを生成しません。

インターフェースが`disable`モードでコンパイルされたインターフェースからボディを持つmethodを継承し、それをoverrideしない場合、`DefaultImpls`スタブが生成されます。

一部のクライアントコードが`DefaultImpls`クラスの存在に依存している場合、__バイナリ互換性が損なわれます__。

:::note
インターフェースの委譲が使用されている場合、すべてのインターフェースmethodが委譲されます。 唯一の例外は、非推奨の`@JvmDefault` annotationでannotationが付けられたmethodです。

:::

#### all-compatibility

`all`モードに加えて、[`DefaultImpls`](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)クラスに互換性スタブを生成します。 互換性スタブは、ライブラリおよびランタイムの作成者が、以前のライブラリバージョンに対してコンパイルされた既存のクライアントに対して、下位バイナリ互換性を維持するのに役立ちます。 `all`モードと`all-compatibility`モードは、ライブラリの再コンパイル後にクライアントが使用するライブラリABIサーフェスを変更します。 その意味で、クライアントは以前のライブラリバージョンと互換性がない可能性があります。 これは通常、適切なライブラリのバージョン管理（たとえば、SemVerのメジャーバージョンの増加）が必要であることを意味します。

コンパイラは、`@Deprecated` annotationを使用して`DefaultImpls`のすべてのmemberを生成します。コンパイラは互換性の目的でのみ生成するため、Javaコードでこれらのmemberを使用しないでください。

`all`モードまたは`all-compatibility`モードでコンパイルされたKotlinインターフェースからの継承の場合、`DefaultImpls`互換性スタブは、標準のJVMランタイム解決セマンティクスを使用してインターフェースのdefault methodを呼び出します。

ジェネリックインターフェースを継承するクラスに対して追加の互換性チェックを実行します。`disable`モードでは、特殊化されたシグネチャを持つ追加の暗黙的なmethodが生成される場合がありました。
`disable`モードとは異なり、そのようなmethodを明示的にoverrideせず、クラスに`@JvmDefaultWithoutCompatibility`でannotationを付けない場合、コンパイラはエラーを報告します（詳細については、[このYouTrackの問題](https://youtrack.jetbrains.com/issue/KT-39603)を参照してください）。

## 可視性

Kotlinの可視性modifierは、次の方法でJavaにマップされます。

* `private` memberは`private` memberにコンパイルされます
* `private`トップレベル宣言は`private`トップレベル宣言にコンパイルされます。パッケージプライベートアクセサーも、クラス内からアクセスされる場合は含まれます。
* `protected`は`protected`のままです（Javaは同じパッケージ内の他のクラスからのprotected memberへのアクセスを許可しますが、Kotlinは許可しないため、Javaクラスはコードへのより広範なアクセス権を持つことに注意してください）
* `internal`宣言はJavaでは`public`になります。`internal`クラスのmemberは、Javaから誤って使用することを困難にし、Kotlinのルールに従って互いに見えない同じシグネチャのmemberのオーバーロードを許可するために、name manglingされます。
* `public`は`public`のままです

## KClass

`KClass`型のパラメータを持つKotlin methodを呼び出す必要がある場合があります。
`Class`から`KClass`への自動変換はないため、`Class<T>.kotlin` extension propertyと同等のものを呼び出すことで手動で行う必要があります。

```kotlin
kotlin.jvm.JvmClassMappingKt.getKotlinClass(MainView.class)
```

## @JvmNameを使用したシグネチャの衝突の処理

Kotlinに名前付き関数があり、バイトコードで別のJVM名が必要になる場合があります。
最も顕著な例は、*type erasure*が原因で発生します。

```kotlin
fun List<String>.filterValid(): List<String>
fun List<Int>.filterValid(): List<Int>
```

これらの2つの関数は、JVMシグネチャが同じであるため、並べて定義できません：`filterValid(Ljava/util/List;)Ljava/util/List;`。
Kotlinで同じ名前を付けたい場合は、[`@JvmName`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-name/index.html)でannotationを付け、引数として別の名前を指定できます。

```kotlin
fun List<String>.filterValid(): List<String>

@JvmName("filterValidInt")
fun List<Int>.filterValid(): List<Int>
```

Kotlinからは同じ名前`filterValid`でアクセスできますが、Javaからは`filterValid`と`filterValidInt`になります。

プロパティ`x`と関数`getX()`を並べて持つ必要がある場合にも、同じトリックが適用されます。

```kotlin
val x: Int
    @JvmName("getX_prop")
    get() = 15

fun getX() = 10
```

明示的に実装されたgetterとsetterがないプロパティに対して、生成されたアクセサーmethodの名前を変更するには、`@get:JvmName`および`@set:JvmName`を使用できます。

```kotlin
@get:JvmName("x")
@set:JvmName("changeX")
var x: Int = 23
```

## Overloads generation

通常、デフォルトのパラメータ値を持つKotlin関数を作成した場合、Javaではすべてのパラメータが存在する完全なシグネチャとしてのみ表示されます。 Javaの呼び出し元に複数のoverloadを公開する場合は、[`@JvmOverloads`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-overloads/index.html) annotationを使用できます。

annotationは、コンストラクタ、static methodなどにも使用できます。 インターフェースで定義されたmethodを含む、抽象methodでは使用できません。

```kotlin
class Circle @JvmOverloads constructor(centerX: Int, centerY: Int, radius: Double = 1.0) {
    @JvmOverloads fun draw(label: String, lineWidth: Int = 1, color: String = "red") { /*...*/ }
}
```

デフォルト値を持つパラメータごとに、パラメータリストからこのパラメータと右側のすべてのパラメータが削除された追加のoverloadが1つ生成されます。 この例では、以下が生成されます。

```java
// Constructors:
Circle(int centerX, int centerY, double radius)
Circle(int centerX, int centerY)

// Methods
void draw(String label, int lineWidth, String color) { }
void draw(String label, int lineWidth) { }
void draw(String label) { }
```

[Secondary constructors](classes#secondary-constructors)で説明されているように、クラスのすべてのコンストラクタパラメータにデフォルト値がある場合、引数のないパブリックコンストラクタが生成されます。 これは、`@JvmOverloads` annotationが指定されていない場合でも機能します。

## Checked exceptions

Kotlinにはchecked exceptionsはありません。
したがって、通常、Kotlin関数のJavaシグネチャは、スローされたexceptionsを宣言しません。
したがって、Kotlinに次のような関数がある場合：

```kotlin
// example.kt
package demo

fun writeToFile() {
    /*...*/
    throw IOException()
}
```

Javaから呼び出して例外をキャッチする場合：

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
この問題を回避するには、Kotlinで[`@Throws`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throws/index.html) annotationを使用します。

```kotlin
@Throws(IOException::class)
fun writeToFile() {
    /*...*/
    throw IOException()
}
```

## Null-safety

JavaからKotlin関数を呼び出す場合、nullableでないパラメータとして`null`を渡すことを妨げるものはありません。
そのため、Kotlinはnullableでないものを期待するすべてのパブリック関数に対してランタイムチェックを生成します。
これにより、Javaコードですぐに`NullPointerException`が発生します。

## Variant generics

Kotlinクラスが[declaration-site variance](generics#declaration-site-variance)を使用する場合、Javaコードからの使用方法には2つのオプションがあります。 たとえば、次のクラスとそれを使用する2つの関数があるとします。

```kotlin
class Box<out T>(val value: T)

interface Base
class Derived : Base

fun boxDerived(value: Derived): Box<Derived> = Box(value)
fun unboxBase(box: Box<Base>): Base = box.value
```

これらの関数をJavaに変換するナイーブな方法は次のとおりです。

```java
Box<Derived> boxDerived(Derived value) { ... }
Base unboxBase(Box<Base> box) { ... }
```

問題は、Kotlinでは`unboxBase(boxDerived(Derived()))`を記述できますが、Javaでは不可能です。
なぜなら、Javaではクラス`Box`はパラメータ`T`で*不変*であり、したがって`Box<Derived>`は`Box<Base>`のサブタイプではないためです。
Javaでこれを機能させるには、`unboxBase`を次のように定義する必要があります。

```java
Base unboxBase(Box<? extends Base> box) { ... }  
```

この宣言は、Javaの*ワイルドカード型*（`? extends Base`）を使用して、use-site varianceを介してdeclaration-site varianceをエミュレートします。なぜなら、Javaにはそれしかありません。

Kotlin APIをJavaで機能させるために、コンパイラは共変的に定義された`Box`に対して`Box<Super>`を`Box<? extends Super>`として生成します。
（または、反変的に定義された`Foo`の場合は`Foo<? super Bar>`） *パラメータとして*表示される場合。 戻り値の場合、ワイルドカードは生成されません。そうしないと、Javaクライアントはそれらを処理する必要があるためです
（そして、それは一般的なJavaコーディングスタイルに反します）。 したがって、例の関数は、実際には次のように変換されます。

```java

// return type - no wildcards
Box<Derived> boxDerived(Derived value) { ... }
 
// parameter - wildcards 
Base unboxBase(Box<? extends Base> box) { ... }
```

:::note
引数の型がfinalの場合、通常、ワイルドカードを生成する意味はないため、`Box<String>`は常に`Box<String>`です。
それがどのような位置にあるかに関係ありません。

:::

デフォルトで生成されない場所にワイルドカードが必要な場合は、`@JvmWildcard` annotationを使用します。

```kotlin
fun boxDerived(value: Derived): Box<@JvmWildcard Derived> = Box(value)
// is translated to 
// Box<? extends Derived> boxDerived(Derived value) { ... }
```

反対に、生成される場所にワイルドカードが必要ない場合は、`@JvmSuppressWildcards`を使用します。

```kotlin
fun unboxBase(box: Box<@JvmSuppressWildcards Base>): Base = box.value
// is translated to 
// Base unboxBase(Box<Base> box) { ... }
```

:::note
`@JvmSuppressWildcards`は個々の型の引数だけでなく、関数などの宣言全体やクラスにも使用でき、それらの中のすべてのワイルドカードが抑制されます。

:::

### Nothing型の変換

[`Nothing`](exceptions#the-nothing-type)型は特別です。Javaに自然な対応物がないためです。 実際、`java.lang.Void`を含むすべてのJava参照型は、値を`null`として受け入れますが、`Nothing`はそれさえ受け入れません。 したがって、この型はJavaの世界で正確に表現することはできません。 このため、Kotlinは`Nothing`型の引数が使用される場所にraw typeを生成します。

```kotlin
fun emptyList(): List<Nothing> = listOf()
// is translated to
// List emptyList() { ... }
```