[//]: # (title: this 표현식)

현재 *리시버*를 나타내려면 `this` 표현식을 사용합니다:

*   [클래스](classes.md#inheritance)의 멤버 내에서 `this`는 해당 클래스의 현재 객체를 참조합니다.
*   [확장 함수](extensions.md) 또는 [리시버가 있는 함수 리터럴](lambdas.md#function-lit erals-with-receiver)에서
    `this`는 점(.)의 왼쪽에 전달되는 *리시버* 매개변수를 나타냅니다.

`this`에 한정자가 없으면 *가장 안쪽의 둘러싸는 스코프*를 참조합니다. 다른 스코프의 `this`를 참조하려면 *레이블 한정자*를 사용합니다:

## 한정된 this

바깥 스코프([클래스](classes.md), [확장 함수](extensions.md), 또는 레이블이 지정된 [리시버가 있는 함수 리터럴](lambdas.md#function-literals-with-receiver))에서 `this`에 접근하려면 `this@label`이라고 작성합니다. 여기서 `@label`은 `this`가 속하고자 하는 스코프에 대한 [레이블](returns.md)입니다:

```kotlin
class A { // implicit label @A
    inner class B { // implicit label @B
        fun Int.foo() { // implicit label @foo
            val a = this@A // A's this
            val b = this@B // B's this

            val c = this // foo()'s receiver, an Int
            val c1 = this@foo // foo()'s receiver, an Int

            val funLit = lambda@ fun String.() {
                val d = this // funLit's receiver, a String
            }

            val funLit2 = { s: String ->
                // foo()'s receiver, since enclosing lambda expression
                // doesn't have any receiver
                val d1 = this
            }
        }
    }
}
```

## 암시적 this

`this`의 멤버 함수를 호출할 때 `this.` 부분을 생략할 수 있습니다.
같은 이름을 가진 멤버가 아닌 함수가 있다면, 주의해서 사용하세요. 경우에 따라 해당 함수가 대신 호출될 수 있기 때문입니다:

```kotlin
fun main() {
    fun printLine() { println("Local function") }
    
    class A {
        fun printLine() { println("Member function") }

        fun invokePrintLine(omitThis: Boolean = false) {
            if (omitThis) printLine()
            else this.printLine()
        }
    }
    
    A().invokePrintLine() // Member function
    A().invokePrintLine(omitThis = true) // Local function
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}