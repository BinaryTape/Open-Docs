[//]: # (title: インターフェース)

Kotlin のインターフェースは、抽象メソッドの宣言だけでなく、メソッドの実装も含むことができます。抽象クラスとの違いは、インターフェースが状態を持つことができない点です。プロパティを持つことはできますが、それらは抽象的であるか、アクセサーの実装を提供する必要があります。

インターフェースは `interface` キーワードを使用して定義します。

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

インターフェース内でプロパティを宣言できます。インターフェースで宣言されたプロパティは、抽象的であるか、アクセサーの実装を提供できます。インターフェースで宣言されたプロパティはバッキングフィールドを持つことができず、したがってインターフェースで宣言されたアクセサーはそれらを参照できません。

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

インターフェースは他のインターフェースから派生でき、これはメンバーの実装を提供し、新しい関数やプロパティを宣言できることを意味します。当然ながら、そのようなインターフェースを実装するクラスは、不足している実装を定義するだけで済みます。

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

インターフェース *A* と *B* は両方とも関数 *foo()* と *bar()* を宣言しています。両方とも *foo()* を実装していますが、*bar()* を実装しているのは *B* だけです (*bar()* は *A* で抽象としてマークされていません。これは、関数に本体がない場合のインターフェースのデフォルトだからです)。さて、もし具体クラス *C* を *A* から派生させる場合、*bar()* をオーバーライドして実装を提供する必要があります。

しかし、もし *D* を *A* と *B* から派生させる場合、複数のインターフェースから継承したすべてのメソッドを実装する必要があり、*D* がそれらをどのように正確に実装すべきかを指定する必要があります。このルールは、単一の実装を継承したメソッド (*bar()*) と、複数の実装を継承したメソッド (*foo()*) の両方に適用されます。