[//]: # (title: インターフェース)

Kotlinのインターフェースは、抽象メソッドの宣言だけでなく、メソッドの実装も含むことができます。抽象クラスとの違いは、インターフェースが状態を保持できない点です。プロパティを持つことはできますが、それらは抽象であるか、アクセサーの実装を提供する必要があります。

インターフェースは `interface` キーワードを使用して定義されます。

```kotlin
interface MyInterface {
    fun bar()
    fun foo() {
      // optional body
    }
}
```

## インターフェースの実装

クラスやオブジェクトは、1つ以上のインターフェースを実装できます。

```kotlin
class Child : MyInterface {
    override fun bar() {
        // body
    }
}
```

## インターフェースのプロパティ

インターフェースではプロパティを宣言できます。インターフェースで宣言されたプロパティは、抽象であるか、アクセサーの実装を提供できます。インターフェースで宣言されたプロパティはバッキングフィールドを持つことができず、したがってインターフェースで宣言されたアクセサーはそれらを参照できません。

```kotlin
interface MyInterface {
    val prop: Int // abstract

    val propertyWithImplementation: String
        get() = "foo"

    fun foo() {
        print(prop)
    }
}

class Child : MyInterface {
    override val prop: Int = 29
}
```

## インターフェースの継承

インターフェースは他のインターフェースから派生できます。これは、メンバーの実装を提供し、新しい関数やプロパティを宣言できることを意味します。当然ながら、そのようなインターフェースを実装するクラスは、不足している実装を定義するだけで済みます。

```kotlin
interface Named {
    val name: String
}

interface Person : Named {
    val firstName: String
    val lastName: String
    
    override val name: String get() = "$firstName $lastName"
}

data class Employee(
    // implementing 'name' is not required
    override val firstName: String,
    override val lastName: String,
    val position: Position
) : Person
```

## オーバーライドの競合の解決

スーパークラスのリストに多くの型を宣言すると、同じメソッドの複数の実装を継承する場合があります。

```kotlin
interface A {
    fun foo() { print("A") }
    fun bar()
}

interface B {
    fun foo() { print("B") }
    fun bar() { print("bar") }
}

class C : A {
    override fun bar() { print("bar") }
}

class D : A, B {
    override fun foo() {
        super<A>.foo()
        super<B>.foo()
    }

    override fun bar() {
        super<B>.bar()
    }
}
```

インターフェース *A* と *B* はどちらも関数 *foo()* と *bar()* を宣言しています。両方とも *foo()* を実装していますが、*bar()* を実装しているのは *B* だけです（*A* では *bar()* は抽象としてマークされていません。これは関数に本体がない場合のインターフェースのデフォルトだからです）。さて、もし具体的なクラス *C* を *A* から派生させる場合、*bar()* をオーバーライドして実装を提供する必要があります。

しかし、*D* を *A* と *B* から派生させる場合、複数のインターフェースから継承したすべてのメソッドを実装する必要があり、*D* がそれらをどのように正確に実装すべきかを指定する必要があります。このルールは、単一の実装を継承したメソッド（*bar()*）と、複数の実装を継承したメソッド（*foo()*）の両方に適用されます。

## インターフェース関数のJVMデフォルトメソッド生成

JVMでは、インターフェースで宣言された関数はデフォルトメソッドにコンパイルされます。
この動作は、`-jvm-default` コンパイラオプションを以下の値で使用して制御できます。

*   `enable` (デフォルト): インターフェース内にデフォルトの実装を生成し、サブクラスと `DefaultImpls` クラスにブリッジ関数を含めます。このモードは、古いKotlinバージョンとのバイナリ互換性を維持するために使用します。
*   `no-compatibility`: インターフェース内にデフォルトの実装のみを生成します。このモードは互換性ブリッジと `DefaultImpls` クラスをスキップするため、新しいKotlinコードに適しています。
*   `disable`: デフォルトメソッドをスキップし、互換性ブリッジと `DefaultImpls` クラスのみを生成します。

`-jvm-default` コンパイラオプションを設定するには、Gradle Kotlin DSLで `jvmDefault` プロパティを設定します。

```kotlin
kotlin {
    compilerOptions {
        jvmDefault = JvmDefaultMode.NO_COMPATIBILITY
    }
}