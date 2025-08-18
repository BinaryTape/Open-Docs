[//]: # (title: 在构建器中使用构建器类型推断)

Kotlin 支持*构建器类型推断*（或构建器推断），这在使用泛型构建器时会非常有用。它帮助编译器根据其 lambda 实参内部的其他调用的类型信息，推断构建器调用的类型实参。

请看 [`buildMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-map.html) 用法的这个示例：

```kotlin
fun addEntryToMap(baseMap: Map<String, Number>, additionalEntry: Pair<String, Int>?) {
   val myMap = buildMap {
       putAll(baseMap)
       if (additionalEntry != null) {
           put(additionalEntry.first, additionalEntry.second)
       }
   }
}
```

这里没有足够的类型信息以常规方式推断类型实参，但构建器推断可以分析 lambda 实参内部的调用。根据 `putAll()` 和 `put()` 调用的类型信息，编译器可以自动将 `buildMap()` 调用的类型实参推断为 `String` 和 `Number`。构建器推断允许在使用泛型构建器时省略类型实参。

## 编写你自己的构建器

### 启用构建器推断的要求

> 在 Kotlin 1.7.0 之前，为构建器函数启用构建器推断需要 `-Xenable-builder-inference` 编译器选项。
> 在 1.7.0 中，此选项默认启用。
>
{style="note"}

要让构建器推断在你的构建器中工作，请确保其声明有一个带接收者的函数类型的构建器 lambda 形参。对接收者类型也有两个要求：

1. 它应该使用构建器推断需要推断的类型实参。例如：
   ```kotlin
   fun <V> buildList(builder: MutableList<V>.() -> Unit) { ... }
   ```
   
   > 请注意，直接传递类型形参的类型（例如 `fun <T> myBuilder(builder: T.() -> Unit)`）尚不支持。
   > 
   {style="note"}

2. 它应该提供包含相应类型形参的公共成员或扩展在其签名中。例如：
   ```kotlin
   class ItemHolder<T> {
       private val items = mutableListOf<T>()

       fun addItem(x: T) {
           items.add(x)
       }

       fun getLastItem(): T? = items.lastOrNull()
   }
   
   fun <T> ItemHolder<T>.addAllItems(xs: List<T>) {
       xs.forEach { addItem(it) }
   }

   fun <T> itemHolderBuilder(builder: ItemHolder<T>.() -> Unit): ItemHolder<T> = 
       ItemHolder<T>().apply(builder)

   fun test(s: String) {
       val itemHolder1 = itemHolderBuilder { // itemHolder1 的类型是 ItemHolder<String>
           addItem(s)
       }
       val itemHolder2 = itemHolderBuilder { // itemHolder2 的类型是 ItemHolder<String>
           addAllItems(listOf(s)) 
       }
       val itemHolder3 = itemHolderBuilder { // itemHolder3 的类型是 ItemHolder<String?>
           val lastItem: String? = getLastItem()
           // ...
       }
   }
   ```

### 支持的特性

构建器推断支持：
* 推断多个类型实参
  ```kotlin
  fun <K, V> myBuilder(builder: MutableMap<K, V>.() -> Unit): Map<K, V> { ... }
  ```
* 在一次调用中推断多个构建器 lambda 的类型实参，包括相互依赖的 lambda。
  ```kotlin
  fun <K, V> myBuilder(
      listBuilder: MutableList<V>.() -> Unit,
      mapBuilder: MutableMap<K, V>.() -> Unit
  ): Pair<List<V>, Map<K, V>> =
      mutableListOf<V>().apply(listBuilder) to mutableMapOf<K, V>().apply(mapBuilder)
  
  fun main() {
      val result = myBuilder(
          { add(1) },
          { put("key", 2) }
      )
      // result 的类型是 Pair<List<Int>, Map<String, Int>>
  }
  ```
* 推断类型形参是 lambda 的形参或返回类型的类型实参
  ```kotlin
  fun <K, V> myBuilder1(
      mapBuilder: MutableMap<K, V>.() -> K
  ): Map<K, V> = mutableMapOf<K, V>().apply { mapBuilder() }
  
  fun <K, V> myBuilder2(
      mapBuilder: MutableMap<K, V>.(K) -> Unit
  ): Map<K, V> = mutableMapOf<K, V>().apply { mapBuilder(2 as K) }
  
  fun main() {
      // result1 被推断为 Map<Long, String> 类型
      val result1 = myBuilder1 {
          put(1L, "value")
          2
      }
      val result2 = myBuilder2 {
          put(1, "value 1")
          // 你可以将 `it` 用作“推迟的类型变量”类型
          // 详见下文
          put(it, "value 2")
      }
  }
  ```

## 构建器推断的工作原理

### 推迟的类型变量

构建器推断通过*推迟的类型变量*工作，这些变量在构建器推断分析期间出现在构建器 lambda 内部。推迟的类型变量是正在推断过程中的类型实参的类型。编译器使用它来收集有关该类型实参的类型信息。

请看 [`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html) 的示例：

```kotlin
val result = buildList {
    val x = get(0)
}
```

这里 `x` 的类型是推迟的类型变量：`get()` 调用返回 `E` 类型的值，但 `E` 本身尚未固定。此时，`E` 的具体类型是未知的。

当推迟的类型变量的值与具体类型关联时，构建器推断会收集这些信息，以便在构建器推断分析结束时推断相应类型实参的结果类型。例如：

```kotlin
val result = buildList {
    val x = get(0)
    val y: String = x
} // result 被推断为 List<String> 类型
```

在推迟的类型变量被赋值给 `String` 类型的变量后，构建器推断获得 `x` 是 `String` 子类型的信息。此赋值是构建器 lambda 中的最后一条语句，因此构建器推断分析以将类型实参 `E` 推断为 `String` 的结果结束。

请注意，你始终可以使用推迟的类型变量作为接收者来调用 `equals()`、`hashCode()` 和 `toString()` 函数。

### 影响构建器推断结果

构建器推断可以收集不同种类的类型信息，这些信息会影响分析结果。它考虑：
* 调用 lambda 接收者上使用类型形参类型的成员方法
  ```kotlin
  val result = buildList {
      // 类型实参根据传入的 “value” 实参推断为 String
      add("value")
  } // result 被推断为 List<String> 类型
  ```
* 为返回类型形参类型的调用指定预期类型
  ```kotlin
  val result = buildList {
      // 类型实参根据预期类型推断为 Float
      val x: Float = get(0)
  } // result 的类型是 List<Float>
  ```
  ```kotlin
  class Foo<T> {
      val items = mutableListOf<T>()
  }

  fun <K> myBuilder(builder: Foo<K>.() -> Unit): Foo<K> = Foo<K>().apply(builder)

  fun main() {
      val result = myBuilder {
          val x: List<CharSequence> = items
          // ...
      } // result 的类型是 Foo<CharSequence>
  }
  ```
* 将推迟的类型变量的类型传入预期具体类型的方法
  ```kotlin
  fun takeMyLong(x: Long) { ... }

  fun String.isMoreThat3() = length > 3

  fun takeListOfStrings(x: List<String>) { ... }

  fun main() {
      val result1 = buildList {
          val x = get(0)
          takeMyLong(x)
      } // result1 的类型是 List<Long>

      val result2 = buildList {
          val x = get(0)
          val isLong = x.isMoreThat3()
      // ...
      } // result2 的类型是 List<String>
  
      val result3 = buildList {
          takeListOfStrings(this)
      } // result3 的类型是 List<String>
  }
  ```
* 获取对 lambda 接收者成员的可调用引用
  ```kotlin
  fun main() {
      val result = buildList {
          val x: KFunction1<Int, Float> = ::get
      } // result 的类型是 List<Float>
  }
  ```
  ```kotlin
  fun takeFunction(x: KFunction1<Int, Float>) { ... }

  fun main() {
      val result = buildList {
          takeFunction(::get)
      } // result 的类型是 List<Float>
  }
  ```

在分析结束时，构建器推断会考虑所有收集到的类型信息，并尝试将其合并到结果类型中。请看示例。

```kotlin
val result = buildList { // 正在推断推迟的类型变量 E
    // 考虑到 E 是 Number 或 Number 的子类型
    val n: Number? = getOrNull(0)
    // 考虑到 E 是 Int 或 Int 的超类型
    add(1)
    // E 被推断为 Int
} // result 的类型是 List<Int>
```

结果类型是与分析期间收集的类型信息相对应的最具体类型。如果给定的类型信息相互矛盾且无法合并，编译器会报告错误。

请注意，Kotlin 编译器仅在常规类型推断无法推断类型实参时才使用构建器推断。这意味着你可以在构建器 lambda 之外提供类型信息，这样就不需要构建器推断分析了。请看示例：

```kotlin
fun someMap() = mutableMapOf<CharSequence, String>()

fun <E> MutableMap<E, String>.f(x: MutableMap<E, String>) { ... }

fun main() {
    val x: Map<in String, String> = buildMap {
        put("", "")
        f(someMap()) // 类型不匹配（预期 String，实际 CharSequence）
    }
}
```

这里出现类型不匹配，因为 map 的预期类型是在构建器 lambda 之外指定的。编译器使用固定的接收者类型 `Map<in String, String>` 分析内部的所有语句。