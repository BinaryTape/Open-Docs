---
title: 리플렉션
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_*Reflection*_ 은 런타임 시 프로그램의 구조를 조사할 수 있게 해주는 언어 및 라이브러리 기능 세트입니다.
함수와 속성은 Kotlin에서 일급 시민이며, 함수형 또는 반응형 스타일을 사용할 때 런타임에 속성 또는 함수의 이름 또는 유형을 학습하는 것과 같이 해당 항목을 조사하는 기능은 필수적입니다.

:::note
Kotlin/JS는 reflection 기능을 제한적으로 지원합니다. [Kotlin/JS의 reflection에 대해 자세히 알아보세요](js-reflection).

:::

## JVM dependency

JVM 플랫폼에서 Kotlin 컴파일러 배포판에는 reflection 기능을 사용하는 데 필요한 런타임 구성 요소가 별도의 아티팩트인 `kotlin-reflect.jar`로 포함되어 있습니다. 이는 reflection 기능을 사용하지 않는 애플리케이션의 런타임 라이브러리의 필요한 크기를 줄이기 위한 것입니다.

Gradle 또는 Maven 프로젝트에서 reflection을 사용하려면 `kotlin-reflect`에 대한 dependency를 추가하세요.

* Gradle에서:

    <Tabs groupId="build-script">
    <TabItem value="kotlin" label="Kotlin" default>

    ```kotlin
    dependencies {
        implementation(kotlin("reflect"))
    }
    ```

    </TabItem>
    <TabItem value="groovy" label="Groovy" default>
    
    ```groovy
    dependencies {
        implementation "org.jetbrains.kotlin:kotlin-reflect:2.1.20"
    }
    ```

    </TabItem>
    </Tabs>

* Maven에서:
    
    ```xml
    <dependencies>
      <dependency>
          <groupId>org.jetbrains.kotlin</groupId>
          <artifactId>kotlin-reflect</artifactId>
      </dependency>
    </dependencies>
    ```

Gradle 또는 Maven을 사용하지 않는 경우 프로젝트의 classpath에 `kotlin-reflect.jar`가 있는지 확인하세요.
다른 지원되는 경우(명령줄 컴파일러 또는 Ant를 사용하는 IntelliJ IDEA 프로젝트) 기본적으로 추가됩니다. 명령줄 컴파일러와 Ant에서는 `-no-reflect` 컴파일러 옵션을 사용하여 classpath에서 `kotlin-reflect.jar`를 제외할 수 있습니다.

## Class references

가장 기본적인 reflection 기능은 Kotlin 클래스에 대한 런타임 참조를 가져오는 것입니다. 정적으로 알려진 Kotlin 클래스에 대한 참조를 얻으려면 _class literal_ 구문을 사용할 수 있습니다.

```kotlin
val c = MyClass::class
```

참조는 [KClass](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/index.html) 타입 값입니다.

:::note
JVM에서 Kotlin 클래스 참조는 Java 클래스 참조와 동일하지 않습니다. Java 클래스 참조를 얻으려면 `KClass` 인스턴스에서 `.java` 속성을 사용하세요.

:::

### Bound class references

객체를 receiver로 사용하여 동일한 `::class` 구문으로 특정 객체의 클래스에 대한 참조를 가져올 수 있습니다.

```kotlin
val widget: Widget = ...
assert(widget is GoodWidget) { "Bad widget: ${widget::class.qualifiedName}" }
```

receiver 표현식의 타입(`Widget`)에 관계없이 `GoodWidget` 또는 `BadWidget`와 같이 객체의 정확한 클래스에 대한 참조를 얻게 됩니다.

## Callable references

함수, 속성 및 생성자에 대한 참조는
[함수 타입](lambdas#function-types)의 인스턴스로 호출하거나 사용할 수도 있습니다.

모든 callable reference의 공통 상위 타입은 [`KCallable<out R>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-callable/index.html)이며,
여기서 `R`은 반환 값 타입입니다. 이는 속성의 속성 타입이고 생성자의 생성된 타입입니다.

### Function references

아래와 같이 명명된 함수가 선언된 경우 직접 호출할 수 있습니다(`isOdd(5)`):

```kotlin
fun isOdd(x: Int) = x % 2 != 0
```

또는 함수를 함수 타입 값으로 사용하여 다른 함수에 전달할 수 있습니다. 이렇게 하려면 `::` 연산자를 사용하세요.

```kotlin
fun isOdd(x: Int) = x % 2 != 0

fun main() {

    val numbers = listOf(1, 2, 3)
    println(numbers.filter(::isOdd))

}
```

여기서 `::isOdd`는 함수 타입 `(Int) `->` Boolean`의 값입니다.

함수 참조는 파라미터 수에 따라 [`KFunction<out R>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-function/index.html)
하위 타입 중 하나에 속합니다. 예를 들어 `KFunction3<T1, T2, T3, R>`입니다.

`::`는 컨텍스트에서 예상되는 타입을 알 수 있는 경우 오버로드된 함수와 함께 사용할 수 있습니다.
예를 들어:

```kotlin
fun main() {

    fun isOdd(x: Int) = x % 2 != 0
    fun isOdd(s: String) = s == "brillig" || s == "slithy" || s == "tove"
    
    val numbers = listOf(1, 2, 3)
    println(numbers.filter(::isOdd)) // refers to isOdd(x: Int)

}
```

또는 명시적으로 지정된 타입의 변수에 메서드 참조를 저장하여 필요한 컨텍스트를 제공할 수 있습니다.

```kotlin
val predicate: (String) `->` Boolean = ::isOdd   // refers to isOdd(x: String)
```

클래스의 멤버 또는 확장 함수를 사용해야 하는 경우 `String::toCharArray`와 같이 한정해야 합니다.

확장 함수에 대한 참조로 변수를 초기화하더라도 추론된 함수 타입에는 receiver가 없지만 receiver 객체를 허용하는 추가 파라미터가 있습니다. 대신 receiver가 있는 함수 타입을 가지려면 타입을 명시적으로 지정하세요.

```kotlin
val isEmptyStringList: List<String>.() `->` Boolean = List<String>::isEmpty
```

#### Example: function composition

다음 함수를 고려해 보세요.

```kotlin
fun <A, B, C> compose(f: (B) `->` C, g: (A) `->` B): (A) `->` C {
    return { x `->` f(g(x)) }
}
```

이는 전달된 두 함수의 composition을 반환합니다. `compose(f, g) = f(g(*))`.
이 함수를 callable reference에 적용할 수 있습니다.

```kotlin
fun <A, B, C> compose(f: (B) `->` C, g: (A) `->` B): (A) `->` C {
    return { x `->` f(g(x)) }
}

fun isOdd(x: Int) = x % 2 != 0

fun main() {

    fun length(s: String) = s.length
    
    val oddLength = compose(::isOdd, ::length)
    val strings = listOf("a", "ab", "abc")
    
    println(strings.filter(oddLength))

}
```

### Property references

Kotlin에서 속성에 first-class 객체로 액세스하려면 `::` 연산자를 사용하세요.

```kotlin
val x = 1

fun main() {
    println(::x.get())
    println(::x.name) 
}
```

`::x` 표현식은 `KProperty0<Int>` 타입 속성 객체로 평가됩니다. `get()`을 사용하여 값을 읽거나 `name` 속성을 사용하여 속성 이름을 검색할 수 있습니다. 자세한 내용은
[`KProperty` 클래스에 대한 문서](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-property/index.html)를 참조하세요.

`var y = 1`과 같은 변경 가능한 속성의 경우 `::y`는 [`KMutableProperty0<Int>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-mutable-property/index.html) 타입의 값을 반환합니다.
여기에는 `set()` 메서드가 있습니다.

```kotlin
var y = 1

fun main() {
    ::y.set(2)
    println(y)
}
```

속성 참조는 단일 제네릭 파라미터가 있는 함수가 예상되는 곳에서 사용할 수 있습니다.

```kotlin
fun main() {

    val strs = listOf("a", "bc", "def")
    println(strs.map(String::length))

}
```

클래스의 멤버인 속성에 액세스하려면 다음과 같이 한정하세요.

```kotlin
fun main() {

    class A(val p: Int)
    val prop = A::p
    println(prop.get(A(1)))

}
```

확장 속성의 경우:

```kotlin
val String.lastChar: Char
    get() = this[length - 1]

fun main() {
    println(String::lastChar.get("abc"))
}
```

### Interoperability with Java reflection

JVM 플랫폼에서 표준 라이브러리에는 Java reflection 객체 간의 매핑을 제공하는 reflection 클래스에 대한 확장이 포함되어 있습니다(패키지 `kotlin.reflect.jvm` 참조).
예를 들어 Kotlin 속성에 대한 getter 역할을 하는 backing 필드 또는 Java 메서드를 찾으려면 다음과 같이 작성할 수 있습니다.

```kotlin
import kotlin.reflect.jvm.*
 
class A(val p: Int)
 
fun main() {
    println(A::p.javaGetter) // prints "public final int A.getP()"
    println(A::p.javaField)  // prints "private final int A.p"
}
```

Java 클래스에 해당하는 Kotlin 클래스를 가져오려면 `.kotlin` 확장 속성을 사용하세요.

```kotlin
fun getKClass(o: Any): KClass<Any> = o.javaClass.kotlin
```

### Constructor references

생성자는 메서드 및 속성과 마찬가지로 참조할 수 있습니다. 생성자와 동일한 파라미터를 사용하고 적절한 타입의 객체를 반환하는 함수 타입 객체를 프로그램이 예상하는 모든 곳에서 사용할 수 있습니다.
생성자는 `::` 연산자를 사용하고 클래스 이름을 추가하여 참조됩니다. 파라미터가 없고 반환 타입이 `Foo`인 함수 파라미터를 예상하는 다음 함수를 고려해 보세요.

```kotlin
class Foo

fun function(factory: () `->` Foo) {
    val x: Foo = factory()
}
```

`::Foo`, 클래스 `Foo`의 0 인수 생성자를 사용하여 다음과 같이 호출할 수 있습니다.

```kotlin
function(::Foo)
```

생성자에 대한 callable reference는 파라미터 수에 따라
[`KFunction<out R>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-function/index.html) 하위 타입 중 하나로 타입이 지정됩니다.

### Bound function and property references

특정 객체의 인스턴스 메서드를 참조할 수 있습니다.

```kotlin
fun main() {

    val numberRegex = "\\d+".toRegex()
    println(numberRegex.matches("29"))
     
    val isNumber = numberRegex::matches
    println(isNumber("29"))

}
```

예제에서는 `matches` 메서드를 직접 호출하는 대신 해당 메서드에 대한 참조를 사용합니다.
이러한 참조는 해당 receiver에 바인딩됩니다.
직접 호출하거나(위의 예와 같이) 함수 타입 표현식이 예상되는 경우 언제든지 사용할 수 있습니다.

```kotlin
fun main() {

    val numberRegex = "\\d+".toRegex()
    val strings = listOf("abc", "124", "a70")
    println(strings.filter(numberRegex::matches))

}
```

바인딩된 참조와 바인딩되지 않은 참조의 타입을 비교해 보세요.
바인딩된 callable reference에는 receiver가 "연결"되어 있으므로 receiver 타입은 더 이상 파라미터가 아닙니다.

```kotlin
val isNumber: (CharSequence) `->` Boolean = numberRegex::matches

val matches: (Regex, CharSequence) `->` Boolean = Regex::matches
```

속성 참조도 바인딩할 수 있습니다.

```kotlin
fun main() {

    val prop = "abc"::length
    println(prop.get())

}
```

`this`를 receiver로 지정할 필요가 없습니다. `this::foo`와 `::foo`는 동일합니다.

### Bound constructor references

[inner class](nested-classes#inner-classes)의 생성자에 대한 바인딩된 callable reference는 외부 클래스의 인스턴스를 제공하여 얻을 수 있습니다.

```kotlin
class Outer {
    inner class Inner
}

val o = Outer()
val boundInnerCtor = o::Inner
```