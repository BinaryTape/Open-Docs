[//]: # (title: Kotlin 1.7.20 兼容性指南)

_[保持语言现代性](kotlin-evolution-principles.md)_ 和 _[舒适的更新](kotlin-evolution-principles.md)_ 是 Kotlin 语言设计中的基本原则之一。前者指出，阻碍语言演进的结构应该被移除，后者则表示这种移除应该事先充分沟通，以便使代码迁移尽可能顺畅。

通常，不兼容变更只发生在特性发布版本中，但这次我们必须在增量发布版本中引入两项此类变更，以限制 Kotlin 1.7 中变更所引入问题的蔓延。

本文总结了这些变更，为从 Kotlin 1.7.0 和 1.7.10 迁移到 Kotlin 1.7.20 提供参考。

## 基本术语

本文介绍了以下几种兼容性：

- _源兼容性_：源不兼容变更会使原本可以正常编译（无错误或警告）的代码无法再编译。
- _二进制兼容性_：如果两个二进制 artifact 互换时不会导致加载或链接错误，则称它们是二进制兼容的。
- _行为兼容性_：如果同一程序在应用变更前后表现出不同的行为，则称该变更是行为不兼容的。

请记住，这些定义仅针对纯 Kotlin 代码。从其他语言的角度（例如，从 Java）来看，Kotlin 代码的兼容性超出了本文档的范围。

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

### 回滚以修复正确的约束处理

> **问题**：[KT-53813](https://youtrack.jetbrains.com/issue/KT-53813)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源
>
> **简要概述**：回滚修复类型推断约束处理中问题的尝试。这些问题是在实现 [KT-52668](https://youtrack.jetbrains.com/issue/KT-52668) 中描述的变更后在 1.7.0 中出现的。该尝试是在 1.7.10 中进行的，但它反过来又引入了新问题。
>
> **弃用周期**：
>
> - 1.7.20：回滚到 1.7.0 行为

### 禁止某些构建器推断情况以避免与多个 lambda 表达式和解析产生问题交互

> **问题**：[KT-53797](https://youtrack.jetbrains.com/issue/KT-53797)
>
> **组件**：核心语言
>
> **不兼容变更类型**：源
>
> **简要概述**：Kotlin 1.7 引入了一项名为“不受限制的构建器推断”的特性，即使是传递给未用 `@BuilderInference` 注解的形参的 lambda 表达式也能从构建器推断中受益。然而，如果一个函数调用中出现多个此类 lambda 表达式，则可能导致几个问题。
>
> 如果存在多个 lambda 函数，其对应的形参未用 `@BuilderInference` 注解，并且需要使用构建器推断来完成该 lambda 表达式中的类型推断，则 Kotlin 1.7.20 将报告错误。
>
> **弃用周期**：
>
> - 1.7.20：对此类 lambda 函数报告错误，可以使用 `-XXLanguage:+NoBuilderInferenceWithoutAnnotationRestriction` 暂时恢复到 1.7.20 之前的行为