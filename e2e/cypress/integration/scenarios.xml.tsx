/// <reference types="cypress"/>

import LoginPage from '../support/pages/login';
import ViewPage from '../support/pages/view';
import BrowsePage from '../support/pages/browse';
import DetailPage from '../support/pages/detail';

const viewPage = new ViewPage();
const browsePage = new BrowsePage();
const detailPage = new DetailPage();

describe('xml scenario on view entities page', () => {

    //login with valid account
    beforeEach(() => {
        cy.visit('/');
        cy.contains('Sign In');
        cy.fixture('users').then(user => {
            cy.login(user.username, user.password);
        })
    });

    it('has total entities and documents', () => {
        viewPage.getTotalEntities().should('be.equal', 3);
        viewPage.getTotalDocuments().should('be.greaterThan', 1008);
    });

    it('has Person entity with properties and attributes', () => {
        viewPage.expandEntityRow('PersonXML');
        viewPage.getEntityProperty('id').should('contains', 'id');
        viewPage.getEntityDataType('id').should('contains', 'string');
        viewPage.getEntityIndexSettings('id').should('contains', 'Primary Key');
    });

    it('navigates to /browse on entity name click', () => {
        viewPage.getEntity('PersonXML')
            .click()
            .url()
            .should('include', '/browse');
        browsePage.getSelectedEntity().should('contain', 'PersonXML')
    });

});

describe('xml scenario on browse documents page', () => {

    var facets: string[] = ['collection', 'flow'];

    //login with valid account and go to /browse page
    beforeEach(() => {
        cy.visit('/');
        cy.contains('Sign In');
        cy.fixture('users').then(user => {
            cy.login(user.username, user.password);
        })
        cy.wait(500);
        // cy.visit('/browse');
        cy.get('.ant-menu-item').contains('Browse Documents').click();
        cy.wait(1000);
        browsePage.getFacetView();
    });

    it('select "all entities" verify docs, hub/entity properties', () => {
        browsePage.getSelectedEntity().should('contain', 'All Entities');
        cy.wait(2000);
        browsePage.getHubPropertiesExpanded();
        browsePage.getTotalDocuments().should('be.greaterThan', '1008')
        browsePage.getDocuments().each(function (item, i) {
            browsePage.getDocumentEntityName(i).should('exist');
            //browsePage.getDocumentId(i).should('exist');
            browsePage.getDocumentSnippet(i).should('exist');
            browsePage.getDocumentCreatedOn(i).should('exist');
            browsePage.getDocumentSources(i).should('exist');
            browsePage.getDocumentFileType(i).should('exist');
        })

        facets.forEach(function (item) {
            browsePage.getFacet(item).should('exist');
            browsePage.getFacetItems(item).should('exist');
        })
    });

    it('select PersonXML entity and verify entity, docs, hub/entity properties', () => {
        browsePage.selectEntity('PersonXML');
        browsePage.getSelectedEntity().should('contain', 'PersonXML');
        cy.wait(2000);
        browsePage.getHubPropertiesExpanded();
        browsePage.getTotalDocuments().should('be.greaterThan', '5')
        browsePage.getDocuments().each(function (item, i) {
            browsePage.getDocumentEntityName(i).should('exist');
            //browsePage.getDocumentId(i).should('exist');
            browsePage.getDocumentSnippet(i).should('exist');
            browsePage.getDocumentCreatedOn(i).should('exist');
            browsePage.getDocumentSources(i).should('exist');
            browsePage.getDocumentFileType(i).should('exist');
        })

        facets.forEach(function (item) {
            browsePage.getFacet(item).should('exist');
            browsePage.getFacetItems(item).should('exist');
        })
    });

    it('apply facet search and verify docs, hub/entity properties', () => {
        browsePage.selectEntity('All Entities');
        browsePage.getSelectedEntity().should('contain', 'All Entities');
        cy.wait(500);
        browsePage.getHubPropertiesExpanded();
        browsePage.getShowMoreLink().click();
        browsePage.getTotalDocuments().should('be.greaterThan', '1008');
        browsePage.getFacetItemCheckbox('collection', 'PersonXML').click();
        cy.wait(500);
        browsePage.getTotalDocuments().should('be.equal', 6);
        browsePage.getFacetSearchSelectionCount('collection').should('contain', '1');
        browsePage.clearFacetSearchSelection('collection');
        browsePage.getFacetSearchSelectionCount('collection').should('contain', '0');
    });

    it('search for a simple text/query and verify content', () => {
        cy.wait(500);
        browsePage.search('Alex');
        cy.wait(500);
        browsePage.getTotalDocuments().should('be.equal', 1);
        browsePage.getDocumentEntityName(0).should('exist');
        //browsePage.getDocumentId(0).should('exist');
        browsePage.getDocumentSnippet(0).should('exist');
        browsePage.getDocumentCreatedOn(0).should('exist');
        browsePage.getDocumentSources(0).should('exist');
        browsePage.getDocumentFileType(0).should('exist')
        browsePage.getDocumentFileType(0).should('be.equal', 'xml')
    });

    it('verify instance view of the document', () => {
        cy.wait(500);
        browsePage.search('Alex');
        browsePage.getTotalDocuments().should('be.equal', 1);
        browsePage.getInstanceViewIcon().click();
        detailPage.getInstanceView().should('exist');
        detailPage.getDocumentEntity().should('contain', 'Person');
        detailPage.getDocumentID().should('contain', '0');
        detailPage.getDocumentTimestamp().should('exist');
        detailPage.getDocumentSource().should('contain', 'PersonXMLFlow');
        detailPage.getDocumentFileType().should('contain', 'xml');
        detailPage.getDocumentTable().should('exist');
    });

    it('verify source view of the document', () => {
        cy.wait(500);
        browsePage.search('Alex');
        browsePage.getTotalDocuments().should('be.equal', 1);
        browsePage.getSourceViewIcon().click();
        detailPage.getSourceView().click();
        detailPage.getDocumentXML().should('exist');
    });

});

describe('xml scenario for table on browse documents page', () => {

    //login with valid account and go to /browse page
    beforeEach(() => {
        cy.visit('/');
        cy.contains('Sign In');
        cy.fixture('users').then(user => {
            cy.login(user.username, user.password);
        })
        cy.wait(500);
        // cy.visit('/browse');
        cy.get('.ant-menu-item').contains('Browse Documents').click();
        cy.wait(1000);
        browsePage.getTableView();
    });

    it('select PersonXML entity and verify table', () => {
        browsePage.selectEntity('PersonXML');
        browsePage.getSelectedEntity().should('contain', 'PersonXML');
        cy.wait(2000);
        browsePage.getHubPropertiesExpanded();
        browsePage.getTotalDocuments().should('be.greaterThan', '5')
        //check table rows
        browsePage.getTableRows().should('have.length', 6);
        //check table columns
        browsePage.getTableColumns().should('have.length', 5);
        //check cells data
        for (let i = 2; i <= 6; i++) {
            for (let j = 2; j <= 4; j++) {
                browsePage.getTableCell(i, j).should('not.be.empty')
            }
        }
        /*for (let i = 1; i <= 6; i++) {
            browsePage.getTablePkCell(i).should('not.be.empty')
        }*/
    });

    it('search for a simple text/query and verify content', () => {
        cy.wait(500);
        browsePage.selectEntity('PersonXML');
        browsePage.getSelectedEntity().should('contain', 'PersonXML');
        cy.wait(2000);
        browsePage.search('Hopkins');
        browsePage.getTotalDocuments().should('be.equal', 2);
        browsePage.getTableRows().should('have.length', 2);
    });

});
