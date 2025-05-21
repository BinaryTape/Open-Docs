---
title: インターフェース
---
Kotlin のインターフェースは、抽象メソッドの宣言とメソッドの実装を含むことができます。抽象クラスと異なるのは、インターフェースは状態を保存できないことです。プロパティを持つことはできますが、これらは抽象であるか、アクセサの実装を提供する必要があります。

インターフェースは、キーワード `interface` を使用して定義されます。

```kotlin
interface MyInterface {
    fun bar()
    fun foo() {
      // optional body
    }
}
```

## インターフェースの実装

クラスまたはオブジェクトは、1 つまたは複数のインターフェースを実装できます。

```kotlin
class Child : MyInterface {
    override fun bar() {
        // body
    }
}
```

## インターフェースのプロパティ

インターフェースでプロパティを宣言できます。インターフェースで宣言されたプロパティは、抽象であるか、アクセサの実装を提供することができます。インターフェースで宣言されたプロパティは、バッキングフィールドを持つことができないため、インターフェースで宣言されたアクセサはそれらを参照できません。

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

インターフェースは他のインターフェースから派生できます。つまり、メンバーの実装を提供したり、新しい関数やプロパティを宣言したりできます。当然ながら、このようなインターフェースを実装するクラスは、不足している実装を定義するだけで済みます。

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

スーパークラスのリストに多くの型を宣言すると、同じメソッドの複数の実装を継承する可能性があります。

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

インターフェース *A* と *B* は両方とも関数 *foo()* と *bar()* を宣言します。それらの両方が *foo()* を実装していますが、*B* のみが *bar()* を実装しています（*bar()* は *A* で抽象としてマークされていません。これは、関数に本体がない場合のインターフェースのデフォルトです）。ここで、具象クラス *C* を *A* から派生させる場合は、*bar()* をオーバーライドして実装を提供する必要があります。

ただし、*D* を *A* と *B* から派生させる場合は、複数のインターフェースから継承したすべてのメソッドを実装し、*D* がそれらをどのように実装するかを正確に指定する必要があります。このルールは、単一の実装 (*bar()*) を継承したメソッドと、複数の実装 (*foo()*) を継承したメソッドの両方に適用されます。