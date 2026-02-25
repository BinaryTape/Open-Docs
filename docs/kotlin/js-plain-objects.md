[//]: # (title: JS 普通对象编译器插件)

<primary-label ref="experimental-general"/>

JavaScript (JS) 普通对象编译器插件 (`js-plain-objects`) 允许你以类型安全的方式创建和拷贝 JS 普通对象。

在这里，你可以找到关于 JS 普通对象的信息，以及如何在你的 Kotlin/JS 项目中使用 `js-plain-objects` 编译器插件。

> `js-plain-objects` 插件仅适用于新的 K2 Kotlin 编译器。
>
{style="warning"}

## JS 普通对象

普通对象是通过对象字面量 (`{}`) 创建的包含数据属性的简单 JS 对象。许多 JS API 接受或返回 JS 普通对象用于配置或数据交换。

通过使用 `js-plain-objects` 插件，你可以声明一个 Kotlin 外部接口来描述对象形状，并为其添加 `@JsPlainObject` 注解。随后，编译器会生成便捷的函数来构建和拷贝此类对象，同时保持 Kotlin 的类型安全。

## 启用插件

将 `js-plain-objects` 插件添加到项目的 Gradle 构建配置文件中，如下面的 Kotlin DSL 所示：

<tabs group="js-plain-objects">
<tab title="Kotlin" group-key="kotlin">

```kotlin
// build.gradle.kts
plugins {
    kotlin("multiplatform") version "%kotlinVersion%"
    kotlin("plugin.js-plain-objects") version "%kotlinVersion%"
}

kotlin {
    js {
        browser() // or nodejs()
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
// build.gradle
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
    id 'org.jetbrains.kotlin.plugin.js-plain-objects' version '%kotlinVersion%'
}

kotlin {
    js {
        browser() // or nodejs()
    }
}
```

</tab>
</tabs>

## 声明普通对象类型

启用 `js-plain-objects` 插件后，你就可以声明一个普通对象类型。为外部接口添加 `@JsPlainObject` 注解。例如：

```kotlin
@JsPlainObject
external interface User {
    val name: String
    val age: Int
    // 你可以使用可空类型将属性声明为可选
    val email: String? 
}
```

当插件处理此类接口时，它会生成一个带有两个辅助函数的伴生对象，用于创建和拷贝对象：

```kotlin
@JsPlainObject
external interface User {
    val name: String
    val age: Int
    val email: String?

    // 由插件生成
    @JsExport.Ignore
    companion object {
        inline operator fun invoke(name: String, age: Int, email: String? = NOTHING): User =
            js("({ name: name, age: age, email: email })")

        inline fun copy(source: User, name: String = NOTHING, age: Int = NOTHING, email: String? = NOTHING): User =
            js("Object.assign({}, source, { name: name, age: age, email: email })")
    }
}
```

在前面的示例中：

* `name` 和 `age` 声明时没有可空标记，因此它们是必填的。
* `email` 被声明为可空，因此它是可选的，在创建时可以跳过。
* 运算符 `invoke` 使用提供的属性构建一个新的 JS 普通对象。
* `copy` 函数通过对 `source` 进行浅拷贝并重写任何指定的属性来创建一个新对象。
* 伴生对象被标记为 `@JsExport.Ignore`，以避免这些辅助程序泄露到 JS 导出中。

## 使用普通对象

使用生成的辅助程序创建和拷贝对象：

```kotlin
fun main() {
    val user = User(name = "Name", age = 10)
    val copy = User.copy(user, age = 11, email = "some@user.com")

    println(JSON.stringify(user))
    // { "name": "Name", "age": 10 }
    println(JSON.stringify(copy))
    // { "name": "Name", "age": 11, "email": "some@user.com" }
}
```

上述 Kotlin 代码会编译为 JavaScript：

```javascript
function main () {
    var user = { name: "Name", age: 10 };
    var copy = Object.assign({}, user, { age: 11, email: "some@user.com" });

    println(JSON.stringify(user));
    // { "name": "Name", "age": 10 }
    println(JSON.stringify(copy));
    // { "name": "Name", "age": 11, "email": "some@user.com" }
}
```

使用这种方法创建的任何 JavaScript 对象都是安全的。当你使用错误的属性名称或值类型时，会遇到编译时错误。这种方法也是零成本的，因为生成的代码以内联方式呈现为简单的对象字面量和 `Object.assign` 调用。

## 下一步

在[从 Kotlin 使用 JavaScript 代码](js-interop.md)和 [dynamic 类型](dynamic-type.md)文档中详细了解与 JavaScript 的互操作性。