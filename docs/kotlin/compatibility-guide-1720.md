---
title: "Kotlin 1.7.20 兼容性指南"
---
_[保持语言的现代性](kotlin-evolution-principles)_ 和 _[舒适的更新](kotlin-evolution-principles)_ 是 Kotlin 语言设计的核心原则。前者认为应该移除那些阻碍语言发展的结构，后者认为应该提前充分沟通移除行为，以尽可能平滑地进行代码迁移。

通常，不兼容的变更只发生在 Feature Release（功能版本）中，但这一次我们不得不在一个增量版本中引入两个这样的变更，以限制 Kotlin 1.7 中变更引入的问题的蔓延。

本文档总结了这些变更，并为从 Kotlin 1.7.0 和 1.7.10 迁移到 Kotlin 1.7.20 提供了参考。

## 基本术语

在本文档中，我们引入了几种兼容性：

- _source（源码）_：source-incompatible change（源码不兼容变更）会导致以前编译良好的代码（没有错误或警告）无法再编译
- _binary（二进制）_：如果交换两个二进制构件不会导致加载或链接错误，则称它们是 binary-compatible（二进制兼容）的
- _behavioral（行为）_：如果同一个程序在应用变更前后表现出不同的行为，则称该变更是 behavioral-incompatible（行为不兼容）的

请记住，这些定义仅适用于纯 Kotlin。从其他语言的角度来看 Kotlin 代码的兼容性（例如，从 Java），不在本文档的范围内。

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

### 回滚修复约束处理的尝试

> **Issue**: [KT-53813](https://youtrack.jetbrains.com/issue/KT-53813)
>
> **Component**: Core language
>
> **Incompatible change type**: source（源码）
>
> **Short summary**: 回滚修复类型推断约束处理中的问题的尝试，该问题在 1.7.0 中出现在实现了 [KT-52668](https://youtrack.jetbrains.com/issue/KT-52668) 中描述的变更之后。该尝试在 1.7.10 中进行，但反过来又引入了新的问题。
>
> **Deprecation cycle（弃用周期）**:
>
> - 1.7.20: 回滚到 1.7.0 行为

### 禁止某些构建器推断的情况，以避免与多个 Lambda 和解析产生问题交互

> **Issue**: [KT-53797](https://youtrack.jetbrains.com/issue/KT-53797)
>
> **Component**: Core language
>
> **Incompatible change type**: source（源码）
>
> **Short summary**: Kotlin 1.7 引入了一个名为 unrestricted builder inference（无限制构建器推断）的功能，因此即使传递给没有用 `@BuilderInference` 注释的参数的 Lambda 表达式也可以从构建器推断中受益。但是，如果函数调用中出现多个这样的 Lambda 表达式，则可能会导致一些问题。
>
> 如果多个 Lambda 函数具有相应的未用 `@BuilderInference` 注释的参数，并且需要使用构建器推断来完成 Lambda 表达式中的类型推断，Kotlin 1.7.20 将报告一个错误。
>
> **Deprecation cycle（弃用周期）**:
>
> - 1.7.20: 在此类 Lambda 函数上报告错误，可以使用 `-XXLanguage:+NoBuilderInferenceWithoutAnnotationRestriction` 临时恢复到 1.7.20 之前的行为