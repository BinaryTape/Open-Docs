[//]: # (title: Kotlin 1.7.20 兼容性指南)

_保持语言现代化_ 和 _舒适的更新_ 是 Kotlin 语言设计的_基本原则_。前者指出应移除阻碍语言演进的构造，后者则强调应事先充分沟通此移除，以使代码迁移尽可能顺利。

通常，不兼容变更仅在功能版本发布中发生，但本次我们不得不在一个增量版本中引入两项此类变更，以限制 Kotlin 1.7 变更所带来的问题蔓延。

本文总结了这些变更，为从 Kotlin 1.7.0 和 1.7.10 迁移到 Kotlin 1.7.20 提供参考。

## 基本术语

本文中，我们介绍了以下几种兼容性：

- _源_：源不兼容变更指使原本能够正常编译（无错误或警告）的代码无法再编译
- _二进制_：如果两个二进制产物互相替换不会导致加载或链接错误，则称它们是二进制兼容的
- _行为_：如果同一程序在应用变更前后表现出不同的行为，则称该变更是行为不兼容的

请记住，这些定义仅适用于纯 Kotlin。从其他语言（例如 Java）角度来看的 Kotlin 代码兼容性不在本文讨论范围之内。

## 语言

<!--
### Title

> **Issue**: [KT-NNNNN](https://youtrack.jetbrains.com/issue/KT-NNNNN)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**:
>
> **Deprecation cycle**:
>
> - 1.5.20: warning
> - 1.7.0: report an error
-->

### 回滚尝试以修复正确的约束处理

> **Issue**: [KT-53813](https://youtrack.jetbrains.com/issue/KT-53813)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源
>
> **简述**：回滚了在 1.7.0 中实现 [KT-52668](https://youtrack.jetbrains.com/issue/KT-52668) 所述变更后，针对类型推断约束处理中出现的问题的修复尝试。该尝试在 1.7.10 中进行，但反过来又引入了新问题。
>
> **弃用周期**：
>
> - 1.7.20：回滚到 1.7.0 行为

### 禁止某些构建器推断情况以避免与多重 Lambda 和解析产生问题交互

> **Issue**: [KT-53797](https://youtrack.com/issue/KT-53797)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源
>
> **简述**：Kotlin 1.7 引入了一项名为无限制构建器推断（unrestricted builder inference）的功能，即使是传递给未用 `@BuilderInference` 注解的参数的 lambda 表达式也可以从构建器推断中受益。然而，如果函数调用中出现多个此类 lambda 表达式，则可能导致一些问题。
>
> 如果有多个 lambda 函数，其对应参数未用 `@BuilderInference` 注解，并且需要使用构建器推断来完成 lambda 中的类型推断，那么 Kotlin 1.7.20 将会报告错误。
>
> **弃用周期**：
>
> - 1.7.20：对此类 lambda 函数报告错误，`-XXLanguage:+NoBuilderInferenceWithoutAnnotationRestriction` 可用于暂时恢复到 1.7.20 之前的行为