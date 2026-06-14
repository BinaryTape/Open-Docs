---
title: R8 / ProGuard
---

本页面介绍了 Koin 在代码缩减和混淆 (R8 / ProGuard) 下的表现、Koin 为你保留的内容，以及**你**需要在应用中保留的内容。

## TL;DR

- **Koin 的核心解析对 R8 是安全的。** `get<T>()`、`inject<T>()` 以及 `*Of` 构建器 (`singleOf`、`factoryOf`、`viewModelOf`……) 在**编译时**解析依赖项 —— 它们使用具体化类型，并在 Android/JVM 上通过 `Class.getName()` 作为注册表的键。对你的构造函数**没有运行时反射**，因此你**不需要**代表 Koin 保留你的定义、ViewModel 或它们的构造函数。
- Koin 在其 Android AAR (`koin-android`、`koin-core-viewmodel`、`koin-compose-viewmodel`、`koin-androidx-workmanager`、`koin-androidx-startup`) 中附带了 `consumer-rules.pro`，因此以下规则会自动应用 —— 你通常不需要添加任何内容。
- 你仍然需要保留**其他组件**通过反射加载的类（见下文）。

## Koin 为你保留的内容（附带的消费者规则）

AAR 会静默关于 Koin 内部机制的 R8 警告：

```proguard
-dontwarn org.koin.**
```

`koin-androidx-startup` 还会保留其在清单文件中引用的初始值设定项。这些都不会保留你的应用程序类 —— Koin 不需要保留它们。

## 你必须保留的内容

这些来自平台或库，而不是来自 Koin 的解析：

- **由 `KoinFragmentFactory` 创建的 Fragment** 是通过类名实例化的。请保留你的 Fragment 子类（通常已通过 `@Keep`、布局引用或 AndroidX 规则保留）。
- **WorkManager 的 `ListenableWorker` 子类** 由 `androidx.work` 自身的消费者规则保留。
- **用于进程终止的保存状态。** `SavedStateHandle` 由 androidx 的 `CreationExtras` 提供，而不是由 Koin 提供。你放入其中的值必须像任何其他保存状态一样在 R8 处理后存活 —— 请保留你自己的 `@Parcelize` / `Serializable` 状态类：

```proguard
# 示例 — 保留你自己的保存状态负载
-keep class com.example.** implements android.os.Parcelable { *; }
```

## ViewModel 与 SavedStateHandle (#2044)

一种普遍的观点认为，间歇性的 `No definition found for SavedStateHandle` 崩溃是由 R8 剥离了 Koin 的 ViewModel 反射引起的。**事实并非如此** —— `viewModelOf(::MyViewModel)` 是编译时的，因此在你的 ViewModel 上添加 `-keep` 不会改变 Koin 的解析。

`SavedStateHandle` 仅在 **ViewModel 创建期间**可用（它是从传递给工厂的 `CreationExtras` 中构建的）。请**直接在 ViewModel 构造函数中**解析它 —— 不要延迟解析或在构造完成后解析：

```kotlin
// ✅ 在创建期间解析
class MyViewModel(val handle: SavedStateHandle) : ViewModel()

// ❌ 之后解析 —— 届时 CreationExtras 已经消失
class MyViewModel(koin: Koin) : ViewModel() {
    val handle by lazy { koin.get<SavedStateHandle>() } // 失败
}
```

如果你在 `viewModelScope { }` 内声明 ViewModel，请启用相应的选项以便创建作用域：

```kotlin
startKoin {
    options(viewModelScopeFactory())
    modules(appModule)
}
```

## 非 Android 目标 (JS / WASM / Native)

在 Android/JVM 上，Koin 通过 `Class.getName()` 作为注册表的键，这在 R8 下是稳定的。在 **Kotlin/JS、WASM 和 Native** 上，Koin 使用来自 Kotlin 反射的 `qualifiedName` / `simpleName`。在这些目标上进行激进的名称混淆可能会影响类型标识 —— 在混淆非 Android 目标时，建议优先使用**命名限定符** (`named("...")`)，而不是依赖类名。