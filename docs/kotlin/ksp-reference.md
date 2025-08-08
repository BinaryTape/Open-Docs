[//]: # (title: Java 注解处理到 KSP 参考)

## 程序元素

| **Java** | **KSP 中的对应机制** | **备注** |
| -------- | -------------------- | -------- |
| `AnnotationMirror` | `KSAnnotation` |          |
| `AnnotationValue` | `KSValueArguments` |          |
| `Element` | `KSDeclaration` / `KSDeclarationContainer` |          |
| `ExecutableElement` | `KSFunctionDeclaration` |          |
| `PackageElement` | `KSFile` | KSP 不将包建模为程序元素 |
| `Parameterizable` | `KSDeclaration` |          |
| `QualifiedNameable` | `KSDeclaration` |          |
| `TypeElement` | `KSClassDeclaration` |          |
| `TypeParameterElement` | `KSTypeParameter` |          |
| `VariableElement` | `KSValueParameter` / `KSPropertyDeclaration` |          |

## 类型

KSP 需要显式类型解析，因此 Java 中的一些功能只能通过 `KSType` 以及解析前的相应元素来实现。

| **Java** | **KSP 中的对应机制** | **备注** |
| -------- | -------------------- | -------- |
| `ArrayType` | `KSBuiltIns.arrayType` |          |
| `DeclaredType` | `KSType` / `KSClassifierReference` |          |
| `ErrorType` | `KSType.isError` |          |
| `ExecutableType` | `KSType` / `KSCallableReference` |          |
| `IntersectionType` | `KSType` / `KSTypeParameter` |          |
| `NoType` | `KSType.isError` | 在 KSP 中不适用 |
| `NullType` | | 在 KSP 中不适用 |
| `PrimitiveType` | `KSBuiltIns` | 与 Java 中的原生类型不完全相同 |
| `ReferenceType` | `KSTypeReference` |          |
| `TypeMirror` | `KSType` |          |
| `TypeVariable` | `KSTypeParameter` |          |
| `UnionType` | N/A | Kotlin 每个 catch 代码块只允许一种类型。`UnionType` 即使对于 Java 注解处理器也无法观察到。 |
| `WildcardType` | `KSType` / `KSTypeArgument` |          |

## 杂项

| **Java** | **KSP 中的对应机制** | **备注** |
| -------- | -------------------- | -------- |
| `Name` | `KSName` |          |
| `ElementKind` | `ClassKind` / `FunctionKind` |          |
| `Modifier` | `Modifier` |          |
| `NestingKind` | `ClassKind` / `FunctionKind` |          |
| `AnnotationValueVisitor` | |          |
| `ElementVisitor` | `KSVisitor` |          |
| `AnnotatedConstruct` | `KSAnnotated` |          |
| `TypeVisitor` | |          |
| `TypeKind` | `KSBuiltIns` | 部分可在内置类型中找到，否则检查 `KSClassDeclaration` 以获取 `DeclaredType` |
| `ElementFilter` | `Collection.filterIsInstance` |          |
| `ElementKindVisitor` | `KSVisitor` |          |
| `ElementScanner` | `KSTopDownVisitor` |          |
| `SimpleAnnotationValueVisitor` | | KSP 中不需要 |
| `SimpleElementVisitor` | `KSVisitor` |          |
| `SimpleTypeVisitor` | |          |
| `TypeKindVisitor` | |          |
| `Types` | `Resolver` / `utils` | 部分 `utils` 也已集成到符号接口中 |
| `Elements` | `Resolver` / `utils` |          |

## 详情

了解 Java 注解处理 API 的功能如何通过 KSP 实现。

### AnnotationMirror

| **Java** | **KSP 等效项** |
| -------- | ------------------ |
| `getAnnotationType` | `ksAnnotation.annotationType` |
| `getElementValues` | `ksAnnotation.arguments` |

### AnnotationValue

| **Java** | **KSP 等效项** |
| -------- | ------------------ |
| `getValue` | `ksValueArgument.value` |

### Element

| **Java** | **KSP 等效项** |
| -------- | ------------------ |
| `asType` | `ksClassDeclaration.asType(...)` 仅适用于 `KSClassDeclaration`。需要提供类型实参。 |
| `getAnnotation` | 待实现 |
| `getAnnotationMirrors` | `ksDeclaration.annotations` |
| `getEnclosedElements` | `ksDeclarationContainer.declarations` |
| `getEnclosingElements` | `ksDeclaration.parentDeclaration` |
| `getKind` | 依据 `ClassKind` 或 `FunctionKind` 进行类型检测与转换 |
| `getModifiers` | `ksDeclaration.modifiers` |
| `getSimpleName` | `ksDeclaration.simpleName` |

### ExecutableElement

| **Java** | **KSP 等效项** |
| -------- | ------------------ |
| `getDefaultValue` | 待实现 |
| `getParameters` | `ksFunctionDeclaration.parameters` |
| `getReceiverType` | `ksFunctionDeclaration.parentDeclaration` |
| `getReturnType` | `ksFunctionDeclaration.returnType` |
| `getSimpleName` | `ksFunctionDeclaration.simpleName` |
| `getThrownTypes` | Kotlin 中不需要 |
| `getTypeParameters` | `ksFunctionDeclaration.typeParameters` |
| `isDefault` | 检测父声明是否为接口 |
| `isVarArgs` | `ksFunctionDeclaration.parameters.any { it.isVarArg }` |

### Parameterizable

| **Java** | **KSP 等效项** |
| -------- | ------------------ |
| `getTypeParameters` | `ksFunctionDeclaration.typeParameters` |

### QualifiedNameable

| **Java** | **KSP 等效项** |
| -------- | ------------------ |
| `getQualifiedName` | `ksDeclaration.qualifiedName` |

### TypeElement

<table>
    <tr>
        <td><b>Java</b></td>
        <td><b>KSP 等效项</b></td>
    </tr>
    <tr>
        <td><code>getEnclosedElements</code></td>
        <td><code>ksClassDeclaration.declarations</code></td>
    </tr>
    <tr>
        <td><code>getEnclosingElement</code></td>
        <td><code>ksClassDeclaration.parentDeclaration</code></td>
    </tr>
    <tr>
        <td><code>getInterfaces</code></td>
<td>

```kotlin
// 应该可以在不解析的情况下完成
ksClassDeclaration.superTypes
    .map { it.resolve() }
    .filter { (it?.declaration as? KSClassDeclaration)?.classKind == ClassKind.INTERFACE }
```

</td>
    </tr>
    <tr>
        <td><code>getNestingKind</code></td>
        <td>检测 <code>KSClassDeclaration.parentDeclaration</code> 和 <code>inner</code> 修饰符</td>
    </tr>
    <tr>
        <td><code>getQualifiedName</code></td>
        <td><code>ksClassDeclaration.qualifiedName</code></td>
    </tr>
    <tr>
        <td><code>getSimpleName</code></td>
        <td><code>ksClassDeclaration.simpleName</code></td>
    </tr>
    <tr>
        <td><code>getSuperclass</code></td>
<td>

```kotlin
// 应该可以在不解析的情况下完成
ksClassDeclaration.superTypes
    .map { it.resolve() }
    .filter { (it?.declaration as? KSClassDeclaration)?.classKind == ClassKind.CLASS }
```

</td>
    </tr>
    <tr>
        <td><code>getTypeParameters</code></td>
        <td><code>ksClassDeclaration.typeParameters</code></td>
    </tr>
</table>

### TypeParameterElement

| **Java** | **KSP 等效项** |
| -------- | ------------------ |
| `getBounds` | `ksTypeParameter.bounds` |
| `getEnclosingElement` | `ksTypeParameter.parentDeclaration` |
| `getGenericElement` | `ksTypeParameter.parentDeclaration` |

### VariableElement

| **Java** | **KSP 等效项** |
| -------- | ------------------ |
| `getConstantValue` | 待实现 |
| `getEnclosingElement` | `ksValueParameter.parentDeclaration` |
| `getSimpleName` | `ksValueParameter.simpleName` |

### ArrayType

| **Java** | **KSP 等效项** |
| -------- | ------------------ |
| `getComponentType` | `ksType.arguments.first()` |

### DeclaredType

| **Java** | **KSP 等效项** |
| -------- | ------------------ |
| `asElement` | `ksType.declaration` |
| `getEnclosingType` | `ksType.declaration.parentDeclaration` |
| `getTypeArguments` | `ksType.arguments` |

### ExecutableType

> 函数的 `KSType` 只是由 `FunctionN<R, T1, T2, ..., TN>` 系列表示的签名。
>
{style="note"}

| **Java** | **KSP 等效项** |
| -------- | ------------------ |
| `getParameterTypes` | `ksType.declaration.typeParameters`, `ksFunctionDeclaration.parameters.map { it.type }` |
| `getReceiverType` | `ksFunctionDeclaration.parentDeclaration.asType(...)` |
| `getReturnType` | `ksType.declaration.typeParameters.last()` |
| `getThrownTypes` | Kotlin 中不需要 |
| `getTypeVariables` | `ksFunctionDeclaration.typeParameters` |

### IntersectionType

| **Java** | **KSP 等效项** |
| -------- | ------------------ |
| `getBounds` | `ksTypeParameter.bounds` |

### TypeMirror

| **Java** | **KSP 等效项** |
| -------- | ------------------ |
| `getKind` | 与 `KSBuiltIns` 中的原生类型、`Unit` 类型进行比较，否则为声明的类型 |

### TypeVariable

| **Java** | **KSP 等效项** |
| -------- | ------------------ |
| `asElement` | `ksType.declaration` |
| `getLowerBound` | 待定。仅在提供了捕获且需要显式边界检测时才需要。 |
| `getUpperBound` | `ksTypeParameter.bounds` |

### WildcardType

<table>
    <tr>
        <td><b>Java</b></td>
        <td><b>KSP 等效项</b></td>
    </tr>
    <tr>
        <td><code>getExtendsBound</code></td>
<td>

```kotlin
if (ksTypeArgument.variance == Variance.COVARIANT) ksTypeArgument.type else null
```

</td>
    </tr>
    <tr>
        <td><code>getSuperBound</code></td>
<td>

```kotlin
if (ksTypeArgument.variance == Variance.CONTRAVARIANT) ksTypeArgument.type else null
```

</td>
    </tr>
</table>

### Elements

<table>
    <tr>
        <td><b>Java</b></td>
        <td><b>KSP 等效项</b></td>
    </tr>
    <tr>
        <td><code>getAllAnnotationMirrors</code></td>
        <td><code>KSDeclarations.annotations</code></td>
    </tr>
    <tr>
        <td><code>getAllMembers</code></td>
        <td><code>getAllFunctions</code>，<code>getAllProperties</code> 待实现</td>
    </tr>
    <tr>
        <td><code>getBinaryName</code></td>
        <td>待定，请参见 <a href="https://docs.oracle.com/javase/specs/jls/se13/html/jls-13.html#jls-13.1">Java 规范</a></td>
    </tr>
    <tr>
        <td><code>getConstantExpression</code></td>
        <td>存在常量值，而非表达式</td>
    </tr>
    <tr>
        <td><code>getDocComment</code></td>
        <td>待实现</td>
    </tr>
    <tr>
        <td><code>getElementValuesWithDefaults</code></td>
        <td>待实现</td>
    </tr>
    <tr>
        <td><code>getName</code></td>
        <td><code>resolver.getKSNameFromString</code></td>
    </tr>
    <tr>
        <td><code>getPackageElement</code></td>
        <td>包不受支持，但可以检索包信息。KSP 无法进行包操作</td>
    </tr>
    <tr>
        <td><code>getPackageOf</code></td>
        <td>包不受支持</td>
    </tr>
    <tr>
        <td><code>getTypeElement</code></td>
        <td><code>Resolver.getClassDeclarationByName</code></td>
    </tr>
    <tr>
        <td><code>hides</code></td>
        <td>待实现</td>
    </tr>
    <tr>
        <td><code>isDeprecated</code></td>
<td>

```kotlin
KsDeclaration.annotations.any { 
    it.annotationType.resolve()!!.declaration.qualifiedName!!.asString() == Deprecated::class.qualifiedName
}
```

</td>
    </tr>
    <tr>
        <td><code>overrides</code></td>
        <td><code>KSFunctionDeclaration.overrides</code> / <code>KSPropertyDeclaration.overrides</code> (相应类的成员函数)</td>
    </tr>
    <tr>
        <td><code>printElements</code></td>
        <td>KSP 在大多数类上都有基本的 <code>toString()</code> 实现</td>
    </tr>
</table>

### 类型
{id="type-operations"}

| **Java** | **KSP 等效项** |
| -------- | ------------------ |
| `asElement` | `ksType.declaration` |
| `asMemberOf` | `resolver.asMemberOf` |
| `boxedClass` | 不需要 |
| `capture` | 待定 |
| `contains` | `KSType.isAssignableFrom` |
| `directSuperTypes` | `(ksType.declaration as KSClassDeclaration).superTypes` |
| `erasure` | `ksType.starProjection()` |
| `getArrayType` | `ksBuiltIns.arrayType.replace(...)` |
| `getDeclaredType` | `ksClassDeclaration.asType` |
| `getNoType` | `ksBuiltIns.nothingType` / `null` |
| `getNullType` | 根据上下文，`KSType.markNullable` 可能有用 |
| `getPrimitiveType` | 不需要，检测 `KSBuiltins` |
| `getWildcardType` | 在期望 `KSTypeArgument` 的地方使用 `Variance` |
| `isAssignable` | `ksType.isAssignableFrom` |
| `isSameType` | `ksType.equals` |
| `isSubsignature` | `functionTypeA == functionTypeB` / `functionTypeA == functionTypeB.starProjection()` |
| `isSubtype` | `ksType.isAssignableFrom` |
| `unboxedType` | 不需要 |