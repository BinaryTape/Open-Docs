---
title: 结合构建器类型推断使用构建器
---
Kotlin 支持_构建器类型推断_（或构建器推断），当您使用泛型构建器时，它会非常有用。它帮助编译器根据 lambda 参数内部其他调用的类型信息，推断构建器调用的类型参数。

考虑一下 [`buildMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-map.html) 的用法示例：

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

这里没有足够的类型信息以常规方式推断类型参数，但是构建器推断可以分析 lambda 参数内部的调用。基于 `putAll()` 和 `put()` 调用的类型信息，编译器可以自动将 `buildMap()` 调用的类型参数推断为 `String` 和 `Number`。构建器推断允许在使用泛型构建器时省略类型参数。

## 编写您自己的构建器

### 启用构建器推断的要求

:::note
在 Kotlin 1.7.0 之前，为构建器函数启用构建器推断需要 `-Xenable-builder-inference` 编译器选项。在 1.7.0 中，该选项默认启用。

:::

为了使构建器推断适用于您自己的构建器，请确保其声明具有带有接收者（receiver）的函数类型的构建器 lambda 参数。对于接收者类型（receiver type），还有两个要求：

1. 它应该使用构建器推断应该推断的类型参数。例如：
   ```kotlin
   fun <V> buildList(builder: MutableList<V>.() `->` Unit) { ... }
   ```
   
   > 请注意，尚不支持直接传递类型参数的类型，例如 `fun <T> myBuilder(builder: T.() `->` Unit)`。
   > 
   

2. 它应该提供公共成员或扩展，这些成员或扩展在其签名中包含相应的类型参数。例如：
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

   fun <T> itemHolderBuilder(builder: ItemHolder<T>.() `->` Unit): ItemHolder<T> = 
       ItemHolder<T>().apply(builder)

   fun test(s: String) {
       val itemHolder1 = itemHolderBuilder { // Type of itemHolder1 is ItemHolder<String>
           addItem(s)
       }
       val itemHolder2 = itemHolderBuilder { // Type of itemHolder2 is ItemHolder<String>
           addAllItems(listOf(s)) 
       }
       val itemHolder3 = itemHolderBuilder { // Type of itemHolder3 is ItemHolder<String?>
           val lastItem: String? = getLastItem()
           // ...
       }
   }
   ```

### 支持的特性

构建器推断支持：
* 推断多个类型参数
  ```kotlin
  fun <K, V> myBuilder(builder: MutableMap<K, V>.() `->` Unit): Map<K, V> { ... }
  ```
* 推断一个调用中多个构建器 lambda 的类型参数，包括相互依赖的类型参数
  ```kotlin
  fun <K, V> myBuilder(
      listBuilder: MutableList<V>.() `->` Unit,
      mapBuilder: MutableMap<K, V>.() `->` Unit
  ): Pair<List<V>, Map<K, V>> =
      mutableListOf<V>().apply(listBuilder) to mutableMapOf<K, V>().apply(mapBuilder)
  
  fun main() {
      val result = myBuilder(
          { add(1) },
          { put("key", 2) }
      )
      // result has Pair<List<Int>, Map<String, Int>> type
  }
  ```
* 推断类型参数，这些类型参数的类型参数是 lambda 的参数或返回类型
  ```kotlin
  fun <K, V> myBuilder1(
      mapBuilder: MutableMap<K, V>.() `->` K
  ): Map<K, V> = mutableMapOf<K, V>().apply { mapBuilder() }
  
  fun <K, V> myBuilder2(
      mapBuilder: MutableMap<K, V>.(K) `->` Unit
  ): Map<K, V> = mutableMapOf<K, V>().apply { mapBuilder(2 as K) }
  
  fun main() {
      // result1 has the Map<Long, String> type inferred
      val result1 = myBuilder1 {
          put(1L, "value")
          2
      }
      val result2 = myBuilder2 {
          put(1, "value 1")
          // You can use `it` as "postponed type variable" type
          // See the details in the section below
          put(it, "value 2")
      }
  }
  ```

## 构建器推断如何工作

### 延后类型变量（Postponed type variables）

构建器推断以_延后类型变量_为单位工作，这些变量在构建器推断分析期间出现在构建器 lambda 内部。延后类型变量是正在推断的类型参数的类型。编译器使用它来收集有关类型参数的类型信息。

考虑一下 [`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html) 的示例：

```kotlin
val result = buildList {
    val x = get(0)
}
```

这里 `x` 具有延后类型变量的类型：`get()` 调用返回类型为 `E` 的值，但是 `E` 本身尚未确定。此时，`E` 的具体类型是未知的。

当延后类型变量的值与具体类型关联时，构建器推断会收集此信息，以便在构建器推断分析结束时推断相应类型参数的结果类型。例如：

```kotlin
val result = buildList {
    val x = get(0)
    val y: String = x
} // result has the List<String> type inferred
```

在将延后类型变量赋值给 `String` 类型的变量后，构建器推断会获得 `x` 是 `String` 的子类型的信息。此赋值是构建器 lambda 中的最后一个语句，因此构建器推断分析以将类型参数 `E` 推断为 `String` 的结果结束。

请注意，您始终可以调用 `equals()`、`hashCode()` 和 `toString()` 函数，并将延后类型变量作为接收者。

### 贡献构建器推断结果

构建器推断可以收集不同种类的类型信息，这些信息有助于分析结果。它考虑：
* 调用 lambda 接收者上使用类型参数类型的方法
  ```kotlin
  val result = buildList {
      // Type argument is inferred into String based on the passed "value" argument
      add("value")
  } // result has the List<String> type inferred
  ```
* 为返回类型参数类型（type parameter's type）的调用指定期望类型
  ```kotlin
  val result = buildList {
      // Type argument is inferred into Float based on the expected type
      val x: Float = get(0)
  } // result has the List<Float> type
  ```
  ```kotlin
  class Foo<T> {
      val items = mutableListOf<T>()
  }

  fun <K> myBuilder(builder: Foo<K>.() `->` Unit): Foo<K> = Foo<K>().apply(builder)

  fun main() {
      val result = myBuilder {
          val x: List<CharSequence> = items
          // ...
      } // result has the Foo<CharSequence> type
  }
  ```
* 将延后类型变量的类型传递到期望具体类型的方法中
  ```kotlin
  fun takeMyLong(x: Long) { ... }

  fun String.isMoreThat3() = length > 3

  fun takeListOfStrings(x: List<String>) { ... }

  fun main() {
      val result1 = buildList {
          val x = get(0)
          takeMyLong(x)
      } // result1 has the List<Long> type

      val result2 = buildList {
          val x = get(0)
          val isLong = x.isMoreThat3()
      // ...
      } // result2 has the List<String> type
  
      val result3 = buildList {
          takeListOfStrings(this)
      } // result3 has the List<String> type
  }
  ```
* 获取 lambda 接收者成员的可调用引用（callable reference）
  ```kotlin
  fun main() {
      val result = buildList {
          val x: KFunction1<Int, Float> = ::get
      } // result has the List<Float> type
  }
  ```
  ```kotlin
  fun takeFunction(x: KFunction1<Int, Float>) { ... }

  fun main() {
      val result = buildList {
          takeFunction(::get)
      } // result has the List<Float> type
  }
  ```

在分析结束时，构建器推断会考虑所有收集到的类型信息，并尝试将其合并到结果类型中。参见示例。

```kotlin
val result = buildList { // Inferring postponed type variable E
    // Considering E is Number or a subtype of Number
    val n: Number? = getOrNull(0)
    // Considering E is Int or a supertype of Int
    add(1)
    // E gets inferred into Int
} // result has the List<Int> type
```

结果类型是与分析期间收集的类型信息相对应的最具体类型。如果给定的类型信息是矛盾的并且无法合并，则编译器会报告错误。

请注意，仅当常规类型推断无法推断类型参数时，Kotlin 编译器才使用构建器推断。这意味着您可以在构建器 lambda 之外贡献类型信息，然后不需要构建器推断分析。考虑以下示例：

```kotlin
fun someMap() = mutableMapOf<CharSequence, String>()

fun <E> MutableMap<E, String>.f(x: MutableMap<E, String>) { ... }

fun main() {
    val x: Map<in String, String> = buildMap {
        put("", "")
        f(someMap()) // Type mismatch (required String, found CharSequence)
    }
}
```

这里出现类型不匹配，因为映射的期望类型是在构建器 lambda 之外指定的。编译器使用固定的接收者类型 `Map<in String, String>` 分析内部的所有语句。
  ```