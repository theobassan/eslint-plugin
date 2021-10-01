import { Rule } from 'eslint';
interface NodeComplete {
    parent: Node;
    callee: Node;
    arguments: Node[];
    params: Node[];
}
export type Node = Rule.Node & NodeComplete;
